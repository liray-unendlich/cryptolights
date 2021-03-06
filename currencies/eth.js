// Generated by CoffeeScript 2.1.1
var ETH;

ETH = class ETH {
  constructor() {
    this.ws = null;
    this.socketUrl = "wss://ethersocket.herokuapp.com";
    this.donationAddress = "0xf3Ac6fFCD6451682a753695e56425038dE2b79DD";
  }

  start(txCb, blockCb) {
    if (this.ws) {
      this.stop();
    }
    this.ws = new WebSocket(this.socketUrl);
    this.ws.onclose = () => {
      return setTimeout((() => {
        return this.start(txCb, blockCb);
      }), 1000);
    };
    this.ws.onopen = () => {};
    //@ws.send '2probe'
    //@ws.send '5'
    //@ping = setInterval (=> @ws.send '2'), 25*1000
    return this.ws.onmessage = ({data}) => {
      var delay, i, len, payload, ref, results, tx, type;
      data = data.match(/^\d+(\[.+?)$/);
      if (data) {
        [type, payload] = JSON.parse(data[1]);
        if (type === 'txsUpdate') {
          delay = 1000 / payload.data.pending.length;
          ref = payload.data.pending;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            tx = ref[i];
            setTimeout((function() {
              return typeof txCb === "function" ? txCb({
                amount: tx.value / 1000000000000000000,
                fee: tx.gas * tx.gasPrice / 1000000000000000000,
                link: 'https://etherscan.io/tx/0x' + tx.hash_b,
                donation: tx.to_b === this.donationAddress
              }) : void 0;
            }), delay);
            results.push(delay += delay);
          }
          return results;
        } else {
          return typeof blockCb === "function" ? blockCb({
            count: payload.data[0].txs.length
          }) : void 0;
        }
      }
    };
  }

  stop() {
    this.ws.close();
    clearInterval(this.ping);
    return this.ws = null;
  }

};

//# sourceMappingURL=eth.js.map
