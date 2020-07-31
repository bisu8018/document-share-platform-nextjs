import ReactTooltip from 'react-tooltip'
import * as styles from 'public/static/styles/scss/index.scss'
import Header from './header/Header'
import Footer from './footer/Footer'
import React, { ReactElement, useEffect, useState } from 'react'
import commonView from '../common/commonView'
import ToTopBtn from './common/button/ToTopBtn'
import repos from '../utils/repos'
import { AUTH_APIS } from '../utils/auth'
import LoadingModal from './common/modal/LoadingModal'
import AlertList from './common/alert/AlertList'
import ModalList from './common/modal/ModalList'
import CookiePolicyNotice from './common/notice/CookiePolicyNotice'
import DollarPolicyNotice from './common/notice/DollarPolicyNotice'
import Meta from '../service/model/Meta'
import { useMain } from '../redux/main/hooks'
import common from '../common/common'

export default function(props): ReactElement {
  const { myInfo, isMobile, setMyInfo, setTagList, setIsMobile } = useMain()

  const [init, setInit] = useState(false)
  const [scrollToTopValue, setScrollToTopValue] = useState(0)
  const [path] = useState(props.path)

  let _prevScrollPos = 0
  let isMobileChecker = false

  // 스크롤 이벤트 시 element 관리
  const manageElement = (path: string) =>
    new Promise(resolve => {
      let currentScrollPos = window.pageYOffset
      let headerMainNav = document.getElementById('headerMainNav')
      let totalLoadingBar = document.getElementById('totalLoadingBar')

      let isScrollAtTop = currentScrollPos <= 60
      let isScrollUp = _prevScrollPos > currentScrollPos

      // main 이외 페이지에서 헤더 숨길/표시 처리
      if (path && headerMainNav) {
        headerMainNav.style.marginBottom = '0px'
        headerMainNav.style.top = `${
          isScrollUp || isScrollAtTop ? '0' : '-61'
        }px`
      }

      // main 이외 페이지에서 로딩 숨길/표시 처리
      if (path && totalLoadingBar)
        totalLoadingBar.style.top = `${
          isScrollUp || isScrollAtTop ? `${isMobile ? '55' : '60'}` : '0'
        }px`

      resolve(currentScrollPos)
    })

  // 내 정보 REDUX SET
  const setMyInfoToStore = () => {
    if (AUTH_APIS.isLogin() && myInfo.email.length === 0) {
      return repos.Account.getAccountInfo().then(result => {
        let res = result.user
        if (!res.username || res.username === '') res.username = res.email
        if (!res.picture) res.picture = myInfo.picture

        res.privateDocumentCount = result.privateDocumentCount
        setMyInfo(res)

        return Promise.resolve()
      })
    } else return Promise.resolve()
  }

  // SET 태그 리스트
  const setTagListToStore = () =>
    repos.Document.getTagList('latest').then(result =>
      setTagList(result.tagList)
    )

  // TODO 트랙킹 자리비움 백엔드 로직 배포 시, 기능 추
  // 자리비움 시간 SET
  /*let t = commonData.awayCheckTime // 1 min
  let awayTime = 0 // 자리비움 시간*/

  const setAwayTime = (): void => {
    /*   if (awayTime > 0) awayTime = 0
    if (modalCode === 'away') setModal('')*/
  }

  /*  // Check Away Time
  const setIntervalAwayTime = setInterval(() => {
    awayTime += t
    console.log('interval awaytime', awayTime, modalCode)
    if (awayTime >= t * 15 && modalCode !== 'away') {
      console.log('get in!!')
      setModal('away')
    }
  }, t)
      clearInterval(interval)
  */

  // 모바일 유무 REDUX SET
  const setIsMobileToRedux = (): void => {
    if (commonView.getIsMobile() !== isMobileChecker) {
      isMobileChecker = !isMobileChecker
      setIsMobile(commonView.getIsMobile())
    }
  }

  const handleResize = (): void => setIsMobileToRedux()
  const handleKeydown = (): void => setAwayTime()
  const handleMousemove = (): void => setAwayTime()
  const handleScroll = () =>
    manageElement(path).then((currentScrollPos: number) => {
      setScrollToTopValue(currentScrollPos)
      _prevScrollPos = currentScrollPos
    })

  // SET 이벤트 리스너
  const handleEventListener = (): void => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('mousemove', handleMousemove)
  }

  useEffect(() => {
    repos.init().then(() => {
      // SET 모바일 유무
      void setTagListToStore()

      // SET 이벤트 리스너
      handleEventListener()

      // SET isMobile
      setIsMobileToRedux()

      // SET myInfo
      setMyInfoToStore().then((): void => setInit(true))
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('mousemove', handleMousemove)
    }
  }, [])

  return (
    <div>
      <a className={styles.l_skipLink} href="#article">
        Skip to main
      </a>

      {path && (
        <Header
          title={props.title}
          path={path}
          metaData={new Meta(props.metaData || null)}
        />
      )}

      {path && <CookiePolicyNotice />}

      {path && <DollarPolicyNotice />}

      {common.isServer() || init ? (
        <article className={styles.l_articleContainer} id="article">
          {props.children}
        </article>
      ) : (
        <LoadingModal />
      )}

      <Footer />

      <ModalList />

      <AlertList />

      <ToTopBtn prevScrollPos={scrollToTopValue} />

      <ReactTooltip />

      <div id="callbackIframeContainer" />
    </div>
  )
}
