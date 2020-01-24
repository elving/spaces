import split from 'lodash/split'
import replace from 'lodash/replace'

export default () => {
  const redisSplit = split(
    replace(process.env.REDIS_URL, 'redis://', ''), /\:|\//gim
  )

  return {
    host: redisSplit[0],
    port: redisSplit[1]
  }
}
