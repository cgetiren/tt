/**
 * LiveChat widget – Özel Müşteri yönlendirmesi
 *
 * Backend, widget yüklenmeden önce şunu set etmeli:
 *   window.ozel_musteri = "evet";  // veya "hayır"
 *
 * Test için URL parametresi de desteklenir:
 *   ?ozel_musteri=evet
 */
(function () {
  "use strict";

  function readUrlParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function normalizeOzelMusteri(value) {
    if (value == null || value === "") {
      return "hayır";
    }
    var normalized = String(value).trim().toLowerCase();
    if (normalized === "evet" || normalized === "yes" || normalized === "true" || normalized === "1") {
      return "evet";
    }
    return "hayır";
  }

  function resolveOzelMusteriValue() {
    if (window.ozel_musteri != null && window.ozel_musteri !== "") {
      return window.ozel_musteri;
    }

    var fromUrl = readUrlParam("ozel_musteri");
    if (fromUrl != null) {
      return fromUrl;
    }

    return "hayır";
  }

  function isOzelMusteri(value) {
    return normalizeOzelMusteri(value) === "evet";
  }

  function getOzelMusteriLabel(value) {
    return isOzelMusteri(value) ? "Evet" : "Hayır";
  }

  function applySessionVariables(ozelMusteriValue) {
    LiveChatWidget.call("set_session_variables", {
      "Özel Müşteri": getOzelMusteriLabel(ozelMusteriValue)
    });
  }

  var ozel_musteri = resolveOzelMusteriValue();
  var vip_durumu = isOzelMusteri(ozel_musteri);

  window.__lc = window.__lc || {};
  window.__lc.license = 19727563;
  window.__lc.group = vip_durumu ? 1 : 2;

  window.MiniOyunlarLiveChat = {
    getOzelMusteriDurumu: function () {
      return getOzelMusteriLabel(ozel_musteri);
    },
    getGrupId: function () {
      return vip_durumu ? 1 : 2;
    },
    isOzelMusteri: function () {
      return vip_durumu;
    }
  };

  (function (n, t, c) {
    function i(args) {
      return e._h ? e._h.apply(null, args) : e._q.push(args);
    }

    var e = {
      _q: [],
      _h: null,
      _v: "2.0",
      on: function () {
        i(["on", c.call(arguments)]);
      },
      once: function () {
        i(["once", c.call(arguments)]);
      },
      off: function () {
        i(["off", c.call(arguments)]);
      },
      get: function () {
        if (!e._h) {
          throw new Error("[LiveChatWidget] You can't use getters before load.");
        }
        return i(["get", c.call(arguments)]);
      },
      call: function () {
        i(["call", c.call(arguments)]);
      },
      init: function () {
        var script = t.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.src = "https://cdn.livechatinc.com/tracking.js";
        t.head.appendChild(script);
      }
    };

    if (!n.__lc.asyncInit) {
      e.init();
    }

    n.LiveChatWidget = n.LiveChatWidget || e;
  })(window, document, [].slice);

  function onLiveChatReady() {
    applySessionVariables(ozel_musteri);
  }

  LiveChatWidget.on("ready", onLiveChatReady);

  LiveChatWidget.on("form_submitted", function (data) {
    if (data.type === "prechat") {
      applySessionVariables(ozel_musteri);
    }
  });
})();
