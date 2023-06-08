import {RateLimitRedis} from "./rate_limit_redis.js"

const rateLimitRedis = async (options) => {
    const{headers = true} = options

    globalThis.rateLimitRedis = new RateLimitRedis(options)

    return function (req, res, next) {
        
        globalThis.rateLimitRedis.process(req)
            .then(function(result = {}) {

                if (headers) {
                    res.set('x-ratelimit-limit', result.RateLimitRedis)
                    res.set('x-ratelimit-remaining', result.remaining);
                    res.set('retry-after', result.retry)
                }

                res.status(result.status)
                next()
            })
            .catch(next)
    }
}