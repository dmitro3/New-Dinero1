import chatNamespace from './chat.namespace'
import walletNamespace from './wallet.namespace'
import recentBigWin from './recentBigWin.namespace'

export default function (io) {
  walletNamespace(io)
  chatNamespace(io)
  recentBigWin(io)
}
