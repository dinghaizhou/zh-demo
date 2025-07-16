import { Outlet } from 'umi'
import styles from './index.less'

export default function PureLayout(props: any) {
  return <div className={styles.pureLayout}>
    <Outlet />
  </div>
}


