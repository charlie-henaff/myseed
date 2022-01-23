# MySeed 

**MySeed, grow your discoveries** *a personal media hub*

# How to use ?

## Requirements 

- [docker](https://www.docker.com/get-started) 
- [make](https://www.gnu.org/software/make/)

## Uses

```sh
make            # show help
make start      # start project
```

After start, application should be available at [localhost:3000](https://localhost:3000)

# Concept

> Every time I go onto Spotify to listen music I tell me this : It's always the same songs... 
>
> Yes Spotify know my tastes but sometime I just want to discover new things

- Why Spotify always show me same music ?
    - Cause they know that I like these musics
- Why Spotify know my music taste ?
    - Cause I give it to them
- Why they want me to like the played music ?
    - Cause if I like music I'll stay on the app
- Why I'll like a music ?
    - Cause it remembers me a good moment
    - Cause lyrics speack to me
    - Cause I like the vibes

So let's try to create an app that offers new music that users do not know, but that can refer to good times, lyrics that speak to them or musical vibrations liked.

# Modules
MySeed is like an hub to discover music / streams / videos / art ...  
It includes "modules" that can help user in there discoveries

## MyPlaylist
MyPlaylist should generate a music playlist for the user

Settings        |   Details
--------        |   -------
search          |   playlist based on search string (user / album / song / genre)
new             |   playlist of new songs never heard by this user
genre           |   playlist of songs only for the selected genres