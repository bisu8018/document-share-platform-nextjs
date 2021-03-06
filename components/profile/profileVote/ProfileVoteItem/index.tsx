import React, { ReactElement, useEffect, useState } from 'react'
import Link from 'next/link'
import common from '../../../../common/common'
import commonView from '../../../../common/commonView'
import { APP_CONFIG } from '../../../../app.config'
import RewardCard from '../../../common/card/RewardCard'
import * as styles from 'public/static/styles/scss/index.scss'
import repos from '../../../../utils/repos'
import ProfileVoteClaim from '../ProfileVoteClaim'
import { ProfileVoteTabItemProps } from '../../../../typings/interfaces'
import { useMain } from '../../../../redux/main/hooks'
import Truncate from 'react-truncate'

export default function ProfileVoteItem({
  documentData,
  owner
}: ProfileVoteTabItemProps): ReactElement {
  const { myInfo, isMobile } = useMain()
  const [rewardInfoOpen, setRewardInfo] = useState(false)
  const [reward, setReward] = useState(0)
  const [validClaimAmount, setValidClaimAmount] = useState(0)

  const getCuratorRewards = () =>
    repos.Document.getClaimableReward(documentData.documentId, myInfo.id).then(
      (res: number): void =>
        setValidClaimAmount(
          common.deckToDollar(res)
        )
    )

  const getNDaysRoyalty = () =>
    repos.Document.getNDaysRoyalty(documentData.documentId, 7).then(res => {
      setReward(res)
    })

  const vote = common.toEther(Number(documentData.latestVoteAmount)) || 0
  const view = documentData.latestPageview || 0
  const identification = documentData.author.email

  useEffect(() => {
    void getNDaysRoyalty()
    if (owner) {
      void getCuratorRewards()
    }
  }, [])

  return (
    <div className={styles.pcti_container}>
      <div className={styles.pcti_thumbWrapper}>
        <Link
          href={{
            pathname: '/contents_view',
            query: { seoTitle: documentData.seoTitle }
          }}
          as={'/@' + identification + '/' + documentData.seoTitle}
        >
          <a rel="nofollow" aria-label={documentData.seoTitle + ' thumb nail'}>
            <div className={styles.pcti_thumb}>
              <img
                src={common.getThumbnail(
                  documentData.documentId,
                  isMobile ? 640 : 320,
                  1,
                  documentData.documentName
                )}
                alt={
                  document.title ? document.title : documentData.documentName
                }
                className={styles.pcti_cardImg}
                onError={e => {
                  let element = e.target as HTMLImageElement
                  element.onerror = null
                  element.src =
                    APP_CONFIG.domain().static + '/image/logo-cut.png'
                }}
              />
            </div>
          </a>
        </Link>
      </div>
      <div className={styles.pcti_contentWrapper}>
        <Link
          href={{
            pathname: '/contents_view',
            query: { seoTitle: documentData.seoTitle }
          }}
          as={'/@' + identification + '/' + documentData.seoTitle}
        >
          <a rel="nofollow" aria-label={documentData.title}>
            <div
              className={styles.pcti_title}
              onClick={() => commonView.scrollTop()}
            >
              {documentData.title
                ? documentData.title
                : documentData.documentName}
            </div>
          </a>
        </Link>

        <div className={styles.pcti_descWrapper}>
          <Link
            href={{
              pathname: '/contents_view',
              query: { seoTitle: documentData.seoTitle }
            }}
            as={'/@' + identification + '/' + documentData.seoTitle}
          >
            <a rel="nofollow" aria-label={documentData.desc}>
              {documentData.desc && (
                <Truncate lines={2} ellipsis={<span>...</span>}>
                  {<span className={styles.tdi_text}>{documentData.desc}</span>}
                </Truncate>
              )}
            </a>
          </Link>
        </div>

        <div className={styles.pcti_infoWrapper}>
          <span
            className={styles.pcti_reward}
            onMouseOver={(): void => setRewardInfo(true)}
            onMouseOut={(): void => setRewardInfo(false)}
          >
            $ {common.deckToDollar(reward)}
            <img
              className={styles.pcti_arrow}
              src={
                APP_CONFIG.domain().static + '/image/icon/i_arrow_down_blue.svg'
              }
              alt="arrow button"
            />
          </span>

          {reward > 0 && rewardInfoOpen && (
            <RewardCard reward={reward} documentData={documentData} />
          )}

          <span className={styles.pcti_view}>{view}</span>
          <span className={styles.pcti_vote}>{common.deckStr(vote)}</span>
          <div className={styles.pcti_date}>
            {commonView.dateTimeAgo(documentData.created, false)}
          </div>

          {owner && validClaimAmount > 0 && (
            <div className={isMobile ? 'mt-2' : styles.pcti_claimBtnWrapper}>
              <ProfileVoteClaim
                documentData={documentData}
                validClaimAmount={validClaimAmount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
