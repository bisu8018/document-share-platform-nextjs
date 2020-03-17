import { FadingCircle } from 'better-react-spinkit'
import * as styles from 'public/static/styles/main.scss'
import { psString } from '../../../utils/localization'
import { AUTH_APIS } from '../../../utils/auth'
import { useSelector, useDispatch } from 'react-redux'
import React, { ReactElement, useState } from 'react'
import repos from '../../../utils/repos'
import { setActionMain } from '../../../redux/reducer/main'
import Link from 'next/link'

interface ViewToolBoxProps {
  documentData
}

export default function({ documentData }: ViewToolBoxProps): ReactElement {
  const dispatch = useDispatch()
  const myInfoFromRedux = useSelector(state => state.main.myInfo)
  const [downloadLoading, setDownloadLoading] = useState(false)

  let identification = documentData.author
    ? documentData.author.username && documentData.author.username.length > 0
      ? documentData.author.username
      : documentData.author.email
    : documentData.accountId

  // 문서 다운로드
  const getContentDownload = (documentId: string, documentName: string) => {
    setDownloadLoading(true)

    repos.Document.getDocumentDownloadUrl({
      documentId: documentId
    }).then(
      result => {
        const a = document.createElement('a') as HTMLAnchorElement

        a.style.display = 'none'
        document.body.appendChild(a)
        a.href = result.downloadUrl
        a.setAttribute('download', documentName)
        a.click()

        window.URL.revokeObjectURL(a.href)
        document.body.removeChild(a)

        setDownloadLoading(false)
      },
      (): void => setDownloadLoading(false)
    )
  }

  // 문서 다운로드 전 데이터 SET
  const handleDownloadContent = (): void => {
    if (!documentData) {
      return dispatch(setActionMain.alertCode(2091, {}))
    }
    if (!AUTH_APIS.isAuthenticated() && !myInfoFromRedux.email) {
      return dispatch(setActionMain.alertCode(2003, {}))
    }

    getContentDownload(documentData.documentId, documentData.documentName)
  }

  // 공유 버튼 클릭 관리
  const handleShareBtnClick = (): void =>
    dispatch(setActionMain.modal('share', { documentData }))

  // 투표 버튼 클릭 관리
  const handleVoteBtn = (): void =>
    dispatch(setActionMain.modal('vote', { documentData }))

  // 출판 버튼 클릭 관리
  const handlePublishBtn = (): void =>
    dispatch(setActionMain.modal('publish', { documentData }))

  return (
    <div className={styles.vtb_container}>
      {AUTH_APIS.isAuthenticated() && !documentData.isPublic && (
        <p
          data-tip={psString('tooltip-publish')}
          className={styles.vtb_publishBtn}
          onClick={() => handlePublishBtn}
        >
          <span>
            <i className="material-icons mr-3">publish</i>
            {psString('common-modal-publish')}
          </span>
        </p>
      )}
      {AUTH_APIS.isAuthenticated() && documentData.isPublic && (
        <p
          data-tip={psString('vote-modal-tooltip-1')}
          className={styles.vtb_voteBtn}
          onClick={() => handleVoteBtn()}
        >
          {' '}
          <span>
            <i className="material-icons">how_to_vote</i>{' '}
            {psString('vote-modal-btn')}
          </span>
        </p>
      )}
      <p
        data-tip={psString('tooltip-copy')}
        className={styles.vtb_shareBtn}
        onClick={() => handleShareBtnClick()}
      >
        <span>
          <i className="material-icons">share</i>
          {psString('share-modal-btn')}
        </span>
      </p>
      {!myInfoFromRedux.email && documentData.isDownload && (
        <p
          data-tip={psString('tooltip-download')}
          className={
            styles['vtb_downloadBtn' + (downloadLoading ? 'Disabled' : '')]
          }
          onClick={() => handleDownloadContent()}
        >
          {downloadLoading ? (
            <FadingCircle color="#3681fe" size={17} />
          ) : (
            <span>
              <i className="material-icons">save_alt</i>
              {psString('download-btn')}
            </span>
          )}
        </p>
      )}
      {AUTH_APIS.isAuthenticated() &&
        documentData.author.id === myInfoFromRedux.id && (
          <Link
            href={{
              pathname: '/tracking',
              query: { seoTitle: documentData.seoTitle }
            }}
            as={'/t/@' + identification + '/' + documentData.seoTitle}
          >
            <p
              data-tip={psString('tooltip-tracking')}
              className={styles.vtb_trackingBtn}
            >
              <span>
                <i className="material-icons">bar_chart</i>
                {psString('tracking-btn')}
              </span>
            </p>
          </Link>
        )}
      <div className={styles.common_hr} />
    </div>
  )
}
