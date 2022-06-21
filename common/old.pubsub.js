/*!
 * PubSub. Based on minpubsub by Daniel Lamb <daniellmb.com>
 */
const PubSub = {
  publish: null,
  subscribe: null,
};

(function (context) {

  const cache = {};
  const that = {}; //context for apply()
  function getSubs(topic) {
    const subs = cache[topic] || [];
    cache[topic] = subs;
    return subs;
  }

 /**
  * Publish some data on a named topic.
  * @param {String} topic The channel to publish on
  * @param {Array?} args The data to publish. Each array item is converted into an ordered
  *    arguments on the subscribed functions. 
  * example:
  *    Publish stuff on '/some/topic'. Anything subscribed will be called
  *    with a function signature like: function(a,b,c){ ... }
  *
  *    publish('/some/topic', ['a','b','c']);
  */
  PubSub.publish = function ( /* String */ topic, /* Array? */ args) {

    const subs = getSubs(topic);
    let len = subs.length;
    //can change loop or reverse array if the order matters
    while (len--) {
      subs[len].apply(that, args || []);
    }
  };

  /**
   * 
   * @param {String} topic The channel to subscribe to.
   * @param {Function} callback The handler event. Anytime something is publish'ed on a 
  *    subscribed channel, the callback will be called with the
  *    published array as ordered arguments.
   * @returns Function to unsubscribe the callback from this subscription.
   */
  PubSub.subscribe = function ( /* String */ topic, /* Function */ callback) {
    const subs = getSubs(topic);
    subs.push(callback);
    //return unsubscribe function for this callback
    return () => {
      cache[topic] = subs.filter(cb => cb !== callback);
    }
  };

  // UMD definition to allow for CommonJS, AMD and legacy window
  if (typeof module === 'object' && module.exports) {
    // CommonJS, just export
    module.exports = exports = PubSub;
  } else if (typeof define === 'function' && define.amd) {
    // AMD support
    define(function () {
      return PubSub;
    });
  } else if (typeof context === 'object') {
    // If no AMD and we are in the browser, attach to window
    context.publish = PubSub.publish;
    context.subscribe = PubSub.subscribe;
  }
})(this.window);
