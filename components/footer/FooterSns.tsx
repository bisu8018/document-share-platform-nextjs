import React, { ReactElement } from 'react'
import * as styles from '../../public/static/styles/main.scss'
import { APP_CONFIG } from '../../app.config'

export default function(): ReactElement {
  return (
    <div className={styles.f_sns}>
      <div className={styles.f_snsWrapper}>
        <a
          aria-label="Facebook"
          target="_blank"
          href={'https://www.facebook.com/polarishare/'}
          rel="noopener noreferrer nofollow"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static +
              '/image/sns/white/ic_sns_w_facebook.png'
            }
            alt="Facebook Page"
          />
        </a>
        <a
          target="_blank"
          href={'https://twitter.com/Polarishare'}
          rel="noopener noreferrer nofollow"
          aria-label="Twitter"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static +
              '/image/sns/white/ic_sns_w_twitter.png'
            }
            alt="Twitter Page"
          />
        </a>
        <a
          target="_blank"
          href={'https://open.kakao.com/tm/sent/g8JceZec'}
          rel="noopener noreferrer nofollow"
          aria-label="Kakaotalk"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static +
              '/image/sns/white/ic_sns_w_kakaotalk.png'
            }
            alt="Kakaotalk Page"
          />
        </a>
        <a
          target="_blank"
          href={'https://t.me/polarishare'}
          rel="noopener noreferrer nofollow"
          aria-label="Telegram"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static +
              '/image/sns/white/ic_sns_w_telegram.png'
            }
            alt="Telegram Page"
          />
        </a>
        <a
          target="_blank"
          href={'https://medium.com/polaris-share'}
          rel="noopener noreferrer nofollow"
          aria-label="Medium"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static +
              '/image/sns/white/ic_sns_w_medium.png'
            }
            alt="Medium Page"
          />
        </a>
        <a
          target="_blank"
          href={'https://blog.naver.com/polarishare'}
          rel="noopener noreferrer nofollow"
          aria-label="Blog"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static + '/image/sns/white/ic_sns_w_blog.png'
            }
            alt="Blog Page"
          />
        </a>
        <a
          target="_blank"
          href="https://www.reddit.com/user/polarishare"
          rel="noopener noreferrer nofollow"
          aria-label="Reddit"
        >
          <img
            className={styles.f_snsImgType_1}
            src={
              APP_CONFIG.domain().static +
              '/image/sns/white/ic_sns_w_reddit.png'
            }
            alt="Reddit Page"
          />
        </a>
      </div>
    </div>
  )
}