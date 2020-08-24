import * as styles from 'public/static/styles/scss/index.scss'
import React, { ReactElement } from 'react'
import { SearchBtnProps } from '../../../../typings/interfaces'

export default function SearchButton({
  click,
  path
}: SearchBtnProps): ReactElement {
  const handleSearchBtnClick = () => {
    click && click()
  }

  return (
    <div className={styles.sb_wrapper}>
      <div
        id="commonSearchBtn"
        className={styles[`sb_searchBtn${path ? 'Header' : 'Main'}`]}
        onClick={() => handleSearchBtnClick()}
      />
    </div>
  )
}
