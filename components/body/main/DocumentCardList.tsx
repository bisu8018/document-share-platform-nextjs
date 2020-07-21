import React, { ReactElement } from 'react'
import { psString } from '../../../utils/localization'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import * as styles from 'public/static/styles/scss/index.scss'
import { AUTH_APIS } from '../../../utils/auth'
import { DocumentCardListProps } from '../../../typings/interfaces'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import FavoriteDocumentCardList from '../../../graphql/queries/FavoriteDocumentCardList.graphql'
import HistoryDocumentCardList from '../../../graphql/queries/HistoryDocumentCardList.graphql'
import LatestDocumentCardList from '../../../graphql/queries/LatestDocumentCardList.graphql'
import PopularDocumentCardList from '../../../graphql/queries/PopularDocumentCardList.graphql'
import FeaturedDocumentCardList from '../../../graphql/queries/FeaturedDocumentCardList.graphql'
import MainListMock from '../../common/mock/MainListMock'

const DocumentCardWithoutSSR = dynamic(
  () => import('components/body/main/DocumentCard'),
  { ssr: false }
)

export default function({ path }: DocumentCardListProps): ReactElement {
  const checkAuthComponent = () => path === 'mylist' || path === 'history'

  if (!AUTH_APIS.isLogin() && checkAuthComponent()) return <div />

  const { loading, error, data } = useQuery(
    gql`
      ${{
        latest: LatestDocumentCardList,
        popular: PopularDocumentCardList,
        featured: FeaturedDocumentCardList,
        mylist: FavoriteDocumentCardList,
        history: HistoryDocumentCardList
      }[path]}
    `,
    {
      context: {
        clientName: 'query'
      },
      variables: {
        userId: AUTH_APIS.isLogin() ? AUTH_APIS.getMyInfo().id : ''
      },
      notifyOnNetworkStatusChange: false
    }
  )

  if (loading) return <MainListMock />
  if (error || !data) return <div />

  const dataList = data[Object.keys(data)[0]].findMany

  if (dataList.length === 0) return <div />

  return (
    <div>
      <div className={styles.mcl_subjectWrapper}>
        <Link href={'/contents_list'} as={path}>
          <a aria-label={psString('main-category-' + path)}>
            <div className={styles.mcl_subject}>
              {psString('main-category-' + path)}
            </div>
            <div className={styles.mcl_seeAll}>
              {psString('main-see-all')}
              <i className="material-icons">keyboard_arrow_right</i>
            </div>
          </a>
        </Link>
      </div>

      <div className={styles.mcl_documentCardWrapper}>
        {dataList.map(({ userId, documentId, _id, accountId }, idx) => {
          return (
            idx < 4 &&
            (documentId || _id) && (
              <DocumentCardWithoutSSR
                key={idx}
                userId={userId || accountId}
                documentId={documentId || _id}
                authRequired={checkAuthComponent()}
              />
            )
          )
        })}
      </div>
    </div>
  )
}
