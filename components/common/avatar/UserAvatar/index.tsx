import * as styles from 'public/static/styles/scss/index.scss'
import React, { ReactElement, useEffect, useState } from 'react'
import { UserAvatarProps } from '../../../../typings/interfaces'
import commonView from '../../../../common/commonView'

/*일반 유저 아바타
picture, croppedArea, size 지정하여 사용*/

export default function UserAvatar({
  croppedArea,
  size,
  picture
}: UserAvatarProps): ReactElement {
  const [imgStyle, setImgStyle] = useState({
    width: '100%',
    height: 'auto',
    left: '0',
    top: '0'
  })

  let xLocation = 0
  let yLocation = 0
  let zoom = 1
  let wrapperStyle = {
    width: (size || 30) + 'px',
    height: (size || 30) + 'px'
  }

  useEffect(() => {
    if (picture) {
      commonView.getImgInfoOnPromise(picture).then(imgInfo => {
        if (croppedArea) {
          xLocation = Math.floor(
            (croppedArea.x || xLocation) /
              ((imgInfo ? croppedArea.height : croppedArea.width) / size)
          )
          yLocation = Math.floor(
            (croppedArea.y || yLocation) /
              ((imgInfo ? croppedArea.height : croppedArea.width) / size)
          )
          zoom = croppedArea.zoom || zoom
        }

        setImgStyle({
          width: !imgInfo ? 'auto' : Number(zoom * 100) + '%',
          height: imgInfo ? 'auto' : Number(zoom * 100) + '%',
          left: '-' + xLocation + 'px',
          top: '-' + yLocation + 'px'
        })
      })

      commonView.lazyLoading()
    }
  }, [picture])

  return (
    <div className={styles.ua_container} style={wrapperStyle}>
      <img
        src="/static/image/icon/empty-user.png"
        data-src={picture}
        data-srcset={picture + ' 1x'}
        alt="profile"
        className={'lazy '}
        style={imgStyle}
        onError={e => {
          let element = e.target as HTMLImageElement
          element.onerror = null
          element.srcset = '/static/image/icon/empty-user.png'
        }}
      />
    </div>
  )
}
