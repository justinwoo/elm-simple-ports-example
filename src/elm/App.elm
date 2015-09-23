module App where

import Html exposing (..)
-- we'll be using onClick to fire off our outgoing port
import Html.Events exposing (onClick)

-- types important to our simple application that displays a list of files
type alias File = String
type alias Files = List File

-- the model of our application. simple, right?
type alias Model = {
  files: Files, -- the files we get fetched from the JS side
  times: Int -- the number of times we've gotten data that we'll update with files
}

-- generic Action type that we'll use
type Action =
  NoOp
  | UpdateRequest

-- our first port: the outgoing port
-- first, we need a mailbox if we're going to have a signal and address.
-- we'll declare a mailbox of Action
updateRequestMailbox : Signal.Mailbox Action
-- we'll then instantiate one with a NoOp action by default
updateRequestMailbox = Signal.mailbox NoOp
-- the "port" keyword is used to designate signals that are exposed in the compiled JS.
-- they have the restriction of requiring concrete types, so we'll just emit strings
port updateRequests : Signal String
-- and so for our output stream, we will just map over each Action that comes in
-- and just send down the string "updateRequest" instead.
port updateRequests =
  Signal.map (\_ -> "updateRequest") updateRequestMailbox.signal

-- our input port will be initialized and pushed to from the JS end,
-- so all we need to do is declare the shape of data that will come down the port.
port newFiles : Signal Files

-- declare our updateFiles function. this will send down "folder" functions that
-- will transform our old model into a new model.
updateFiles : Signal (Model -> Model)
-- so in the definition we see that we will map over the newFiles signal
-- and then update the model with new files and update the times property.
updateFiles =
  Signal.map
    (\files -> (\model -> { model | files <- files, times <- model.times + 1 }))
    newFiles

-- our update folder will just take the folders and apply them to our model
update : (Model -> Model) -> Model -> Model
update folder model =
  folder model

-- our updateRequestButton will handle onClick events by sending a message
-- to updateRequestMailbox address with the Action. Give the Html.Events
-- source a red if you're curious about the details.
updateRequestButton : Html
updateRequestButton =
  button
    [
      onClick updateRequestMailbox.address UpdateRequest
    ]
    [text "request update"]

-- the following views are boring
fileView : File -> Html
fileView file =
  div [] [text file]

filesView : Files -> Html
filesView files =
  div [] (List.map (\n -> fileView n) files)

view : Model -> Html
view model =
  div []
    [
      h3 [] [text "Muh Filez:"],
      updateRequestButton,
      h4 [] [text ("times updated: " ++ (toString model.times))],
      filesView model.files
    ]

-- the initial model that we'll be using
model =
  {
    files = [],
    times = 0
  }

-- * if you're unfamiliar with the threading macro, basically it works as this:
-- * (a |> max b) == (max b a)
-- * so below is like (a |> fn1 b |> fn 2 c) == (fn 2 c (fn 1 b (a)))
-- * the former is much easier to read, i think.
-- so below we merge our folder functions, then we pass that into an updater and
-- then our view mapper is there to produce a Signal Html for our main function.
main =
  Signal.mergeMany
    [
      updateFiles
    ]
  |> Signal.foldp update model
  |> Signal.map view
