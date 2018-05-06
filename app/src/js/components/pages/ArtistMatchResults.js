// libs
import React, { Component } from 'react'
import axios from '@js/lib/axios'

// api
import { searchArtist, getArtistTracks } from '@js/api/Track'
import User from '@js/api/User'

// components
import Results from '@components/partials/Results'
import HeroDuplicate from '@components/partials/HeroDuplicate'
import HeroArtist from '@components/partials/HeroArtist'

// local vars
const user = new User()

export default class ArtistMatchResults extends Component {
  constructor(props) {
    super(props)
    // fucking broken router
    this.artist_id = props.location.pathname.split('/').slice(-1)[0]
  }

  render() {
    return (
      <div className="artist-matchResults">
        <Results
          itemPromise={() => searchArtist('spotify:artist:' + this.artist_id)}
          returnUrl="/artist-match"
          resultComponent={(result, item, hideOneResult) => (
            <HeroDuplicate
              matches={result.matches}
              track={result.track}
              hideOneResult={hideOneResult}
            />
          )}
          heroCard={(item, HeroLayoutClasses) => (
            <HeroArtist artist={item} bootstrapClasses={HeroLayoutClasses} />
          )}
          apiTargetKey="artists"
          comparePromise={artist => {
            const results = []

            return user.getPlaylistsFull().then(() =>
              getArtistTracks(artist).then(tracks =>
                axios
                  .all(
                    tracks.map(t => ({
                      track: t,
                      matches: user
                        .detectTrack(t.id)
                        .then(matches => results.push({ track: t, matches })),
                    }))
                  )
                  .then(() =>
                    results.filter(r => {
                      return r.matches.length
                    })
                  )
              )
            )
          }}
        />
      </div>
    )
  }
}
