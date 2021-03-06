import Link from 'next/link'
import React, { ReactElement } from 'react'
import * as styles from 'public/static/styles/scss/index.scss'
import { MenuAvatarProps } from '../../../../typings/interfaces'
import { useMain } from '../../../../redux/main/hooks'

export default function MenuAvatar({ identification }: MenuAvatarProps): ReactElement {
  const { myInfo } = useMain()

  return (
    <Link
      href={{
        pathname: '/@',
        query: { identification: identification }
      }}
      as={'/@' + identification}
    >
      <a className={styles.ma_avatarWrapper} aria-label="Profile page">
        {myInfo.picture.length > 0 ? (
          <img
            src={myInfo.picture}
            className={styles.ma_avatar}
            alt="Link to my profile"
            onError={e => {
              let element = e.target as HTMLImageElement
              element.onerror = null
              element.src = '/static/image/icon/i_profile-default.png'
            }}
          />
        ) : (
          <img
            src='/static/image/icon/i_profile-default.png'
            className={styles.ma_defaultAvatar}
            alt="Link to my profile"
          />
        )}
        <span className={styles.ma_avatarName}>{identification}</span>
      </a>
    </Link>
  )
}
