![License](https://img.shields.io/github/license/charlie-henaff/myseed)

>**Test this app with a Spotify test account**  
>at [charlie-henaff.github.io/myseed](https://charlie-henaff.github.io/myseed) 
>
>*Player unavailable due to non-premium test account*
>
>email : &emsp;&emsp;&emsp;&nbsp; myseed@yopmail.com   
>password : &emsp;&ensp; myseedpwd

# MySeed 

<!-- >**MySeed, grow your discoveries** *a personal media hub*   -->

MySeed is a Spotify API-based web UI that helps users discover music  
It's also a personal project that helps me improve and practice coding  

## Requirements 

- [docker](https://www.docker.com/get-started) 
- [make](https://www.gnu.org/software/make/)

## Usage

```sh
make            # show help
make start      # start project
```

After start, you should create an app on [spotify developer dashboard](https://developer.spotify.com/dashboard) with parameters : 
- Website: http://localhost
- Redirect URIs: http://localhost/login

# Concept

> Every time I go onto Spotify to listen music I tell me this : It's always the same songs...  
> Yes Spotify know my tastes but sometime I just want to discover new things

<!-- - Why Spotify always show me same music ?
    - Cause they know that I like these musics
- Why Spotify know my music taste ?
    - Cause I give it to them
- Why they want me to like the played music ?
    - Cause if I like music I'll stay on the app
- Why I'll like a music ?
    - Cause it remembers me a good moment
    - Cause lyrics speack to me
    - Cause I like the vibes -->

So let's try to create an app that offers new music that users do not know, but that can refer to good times, lyrics that speak to them or just liked musical vibrations.

<!-- # Modules
MySeed is like an hub to discover music / streams / videos / art ...  
It includes "modules" that can help user in there discoveries

## MyPlaylist
MyPlaylist should generate a music playlist for the user

Settings        |   Details
--------        |   -------
search          |   playlist based on search string (user / album / song / genre)
new             |   playlist of new songs never heard by this user
genre           |   playlist of songs only for the selected genres -->
