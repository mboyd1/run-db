const axios = require('axios')

class BitcoinRpc {
  /**
   * Creates an instance to connect with a given rpc url.
   *
   * @param {string} url full connection url, with credentials, port, etc.
   */
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.axios = axios.create({
      validateStatus: (status) => {
        return status >= 200 && status < 300
      }
    })
  }

  /**
   * @param {String} txid
   */
  async getRawTransaction (txid, verbose = true) {
    return this._rpcCall('getrawtransaction', [txid, verbose])
  }

  async getBlockCount () {
    return this._rpcCall('getblockcount', [])
  }

  /**
   * @param {Number} targetHeight block height. must be positive int.
   * @returns object with needed data. txs are bsv transactions
   */
  async getBlockByHeight (targetHeight, verbose = false) {
    return this._rpcCall('getblockbyheight', [targetHeight, verbose])
  }

  async _rpcCall (method, params) {
    const response = await this.axios.post(this.baseUrl, JSON.stringify({
      jsonrpc: '1.0',
      id: new Date().getTime(),
      method: method,
      params: params
    }))

    const { error, result } = response.data

    if (error !== null) {
      throw new Error(error)
    }

    return result
  }
}

module.exports = BitcoinRpc

