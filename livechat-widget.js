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

  var LICENSE_NUMBER = 19727563;
  var GROUP_OZEL_MUSTERI = 1;
  var GROUP_NORMAL_MUSTERI = 2;

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

  function getLiveChatGroupId(value) {
    return isOzelMusteri(value) ? GROUP_OZEL_MUSTERI : GROUP_NORMAL_MUSTERI;
  }

  function applySessionVariables(ozelMusteriValue) {
    LiveChatWidget.call("set_session_variables", {
      "Özel Müşteri": getOzelMusteriLabel(ozelMusteriValue)
    });
  }

  var ozelMusteriValue = resolveOzelMusteriValue();
  var ozelMusteriAktif = isOzelMusteri(ozelMusteriValue);
  var liveChatGroupId = getLiveChatGroupId(ozelMusteriValue);

  window.__lc = window.__lc || {};
  window.__lc.license = LICENSE_NUMBER;
  window.__lc.group = liveChatGroupId;

  window.MiniOyunlarLiveChat = {
    getOzelMusteriDurumu: function () {
      return getOzelMusteriLabel(ozelMusteriValue);
    },
    getGrupId: function () {
      return liveChatGroupId;
    },
    isOzelMusteri: function () {
      return ozelMusteriAktif;
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
    applySessionVariables(ozelMusteriValue);
  }

  LiveChatWidget.on("ready", onLiveChatReady);

  LiveChatWidget.on("form_submitted", function (data) {
    if (data.type === "prechat") {
      applySessionVariables(ozelMusteriValue);
    }
  });
})();
