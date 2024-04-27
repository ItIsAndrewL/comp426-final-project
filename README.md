# comp426-final-project

Music Tinder Web Application Project - Swipe on song snippets to create a discovery list!

## Assignment Design Considerations

For the final project assignment, we must complete the following:

1) 30 points: Having a front end that is interactive and event-driven
2) 30 points: Having a back end that serves at least two resources with a RESTful CRUD (create, read, update, and delete) API.
3) 10 points: Uses at least one 3rd party API
4) 10 points: Uses session-persistent state in some way. For example, authenticating the user and then having user-specific preferences and/or data.
5) 10 points: A pleasing user experience (i.e., easy to use, good design, etc.).
6) 10 points: Quality of presentation video (see below)

Here's how we plan on doing this:

1) The main part of the frontend will be a tinder-like scrolling feature where you will have "swipe right/like" and "swipe left/dislike" buttons. Upon swiping another song snippet will be loaded in. This should satisfy the event-driver and interactive portions.
2) The backend will need to store user log-ins. We can keep track of users liked and disliked songs so we don't send them a song they've heard before on another session. We can also store session playlists for each user. A session playlist will consist of all the liked songs for that session so the user can go back in on spotify and listen to them.
3) The third party API we plan on using is the Spotify API to get the song information/snippets. The route we will most likely need to use for this is `GET /tracks/{id}`. [Route Documentation](https://developer.spotify.com/documentation/web-api/reference/get-track)
4) We plan on having a user sign-in component so users can see past session playlists and possibly link directly into their spotify account
5) The user experience will mostly be in the swiping page, which should have a nice, pleasing design

## Pages

We plan to have 3 pages: `login_page`, `swipe_page`, and `playlist_page`

### login_page

The login page will be where users can sign up for the app or sign in to access their account.

### swipe_page

The swipe page will consist of a center display, where the cover art, artist name, and song name will appear. The song preview will play in the background on loop. There will be a button to like and a button to dislike. The like button should add the song to the current day's liked playlist, the dislike song button should make sure that song is never suggested again to the user.

### playlist_page

The playlist page will house all of the users liked playlists. Users should be able to port their liked playlists to actual spotify playlists that they can save to their account.

## Technical Details

### Frontend

The frontend will be coded using React

### Backend

The backend will be created using Express JS
