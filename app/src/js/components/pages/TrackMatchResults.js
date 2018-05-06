// libs
import React, { Component } from 'react'

// api
import { searchTrack } from '@js/api/Track'
import User from '@js/api/User'

// components
import HeroTrack from '@components/partials/HeroTrack'
import HeroPlaylist from '@components/partials/HeroPlaylist'
import Results from '@components/partials/Results'

// local vars
const user = new User()

export default class TrackMatchResults extends Component {
  constructor(props) {
    super(props)
    // fucking broken router
    this.track_id = props.location.pathname.split('/').slice(-1)[0]
  }

  render() {
    return (
      <div className="track-matchResults">
        <Results
          itemPromise={() => searchTrack('spotify:track:' + this.track_id)}
          returnUrl="/track-match"
          resultComponent={(result, item, hideOneResult) => (
            <HeroPlaylist
              playlist={result}
              track={item}
              hideOneResult={hideOneResult}
            />
          )}
          heroCard={(item, HeroLayoutClasses) => (
            <HeroTrack track={item} bootstrapClasses={HeroLayoutClasses} />
          )}
          apiTargetKey="tracks"
          comparePromise={() => user.detectTrack(this.track_id)}
        />
      </div>
    )
  }
}
