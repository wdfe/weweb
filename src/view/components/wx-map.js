// add map sdk
// export default  !(function () {
//     window.addEventListener('DOMContentLoaded', function () {
//         if (window.__wxConfig__.weweb && window.__wxConfig__.weweb.nomap) return
//         var script = document.createElement('script')
//         script.async = true
//         script.type = 'text/javascript'
//         script.src = 'https://map.qq.com/api/js?v=2.exp&callback=__map_jssdk_init'
//         document.body.appendChild(script)
//     })
//     window.__map_jssdk_id = 0
//     window.__map_jssdk_ready = !1
//     window.__map_jssdk_callback = []
//     window.__map_jssdk_init = function () {
//         for (__map_jssdk_ready = !0; __map_jssdk_callback.length;) {
//             var e = __map_jssdk_callback.pop()
//             e()
//         }
//     }
// })()

// wx-map
window.exparser.registerElement({
  is: 'wx-map',
  behaviors: ['wx-base', 'wx-native'],
  template: '<div id="map" style="width: 100%; height: 100%;"></div>',
  properties: {
    latitude: {
      type: Number,
      public: !0,
      observer: 'latitudeChanged',
      value: 39.92
    },
    longitude: {
      type: Number,
      public: !0,
      observer: 'longitudeChanged',
      value: 116.46
    },
    scale: {
      type: Number,
      public: !0,
      observer: 'scaleChanged',
      scale: 16
    },
    markers: {
      type: Array,
      value: [],
      public: !0,
      observer: 'markersChanged'
    },
    covers: {
      type: Array,
      value: [],
      public: !0,
      observer: 'coversChanged'
    },
    includePoints: {
      type: Array,
      value: [],
      public: !0,
      observer: 'pointsChanged'
    },
    polyline: {
      type: Array,
      value: [],
      public: !0,
      observer: 'linesChanged'
    },
    circles: {
      type: Array,
      value: [],
      public: !0,
      observer: 'circlesChanged'
    },
    controls: {
      type: Array,
      value: [],
      public: !0,
      observer: 'controlsChanged'
    },
    showLocation: {
      type: Boolean,
      value: !1,
      public: !0,
      observer: 'showLocationChanged'
    },
    bindmarkertap: {
      type: String,
      value: '',
      public: !0
    },
    bindcontroltap: {
      type: String,
      value: '',
      public: !0
    },
    bindregionchange: {
      type: String,
      value: '',
      public: !0
    },
    bindtap: {
      type: String,
      value: '',
      public: !0
    },
    _mapId: {
      type: Number
    }
  },
  _delay: function (cb, t, n) {
    this._deferred.push({
      callback: cb,
      args: [t, n]
    })
  },
  _update: function (opt, t) {
    ;(opt.mapId = this._mapId),
    (opt.hide = this.hidden),
    WeixinJSBridge.invoke('updateMap', opt, function (e) {})
  },
  _updatePosition: function () {},
  _transformPath: function (path, t) {
    return path.map(function (item) {
      var tempObj = {}
      return item.iconPath
        ? (Object.keys(item).forEach(function (itemName) {
          tempObj[itemName] = item[itemName]
        }),
          (tempObj.iconPath = wx.getRealRoute(t, tempObj.iconPath)),
          tempObj)
        : item
    })
  },
  _hiddenChanged: function (hide, t) {
    this.$$.style.display = hide ? 'none' : ''
  },
  _transformMarkers: function (markers) {
    var selof = this
    return (markers || []).map(function (marker) {
      var tempObj = {}
      return marker
        ? (Object.keys(marker).forEach(function (t) {
          tempObj[t] = marker[t]
        }),
          marker.name && (tempObj.title = tempObj.title || tempObj.name),
          typeof marker.id !== 'undefined' &&
            selof.bindmarkertap &&
            (tempObj.data = JSON.stringify({
              markerId: marker.id,
              bindmarkertap: selof.bindmarkertap
            })),
          tempObj)
        : tempObj
    })
  },
  _transformControls: function (ctrls) {
    var self = this
    return ctrls.map(function (ctrl) {
      var tempObj = {}
      Object.keys(ctrl).forEach(function (t) {
        tempObj[t] = ctrl[t]
      })
      typeof ctrl.id !== 'undefined' &&
        self.bindcontroltap &&
        ctrl.clickable &&
        (tempObj.data = JSON.stringify({
          controlId: ctrl.id,
          bindcontroltap: self.bindcontroltap
        }))
      return tempObj
    })
  },
  _transformColor: function (hexColor) {
    hexColor.indexOf('#') === 0 && (hexColor = hexColor.substr(1))
    var r = Number('0x' + hexColor.substr(0, 2)),
      g = Number('0x' + hexColor.substr(2, 2)),
      b = Number('0x' + hexColor.substr(4, 2)),
      a = hexColor.substr(6, 2) ? Number('0x' + hexColor.substr(6, 2)) / 255 : 1
    return new qq.maps.Color(r, g, b, a)
  },
  _initFeatures: function () {
    this._mapId &&
      (((this.markers && this.markers.length > 0) ||
        (this.covers && this.covers.length > 0)) &&
        WeixinJSBridge.invoke(
          'addMapMarkers',
          {
            mapId: this._mapId,
            markers: this._transformMarkers(this.markers).concat(this.covers)
          },
          function (e) {}
        ),
        this.includePoints &&
        this.includePoints.length > 0 &&
        WeixinJSBridge.invoke(
          'includeMapPoints',
          {
            mapId: this._mapId,
            points: this.includePoints
          },
          function (e) {}
        ),
        this.polyline &&
        this.polyline.length > 0 &&
        WeixinJSBridge.invoke(
          'addMapLines',
          {
            mapId: this._mapId,
            lines: this.polyline
          },
          function (e) {}
        ),
        this.circles &&
        this.circles.length > 0 &&
        WeixinJSBridge.invoke(
          'addMapCircles',
          {
            mapId: this._mapId,
            circles: this.circles
          },
          function (e) {}
        ),
        this.controls &&
        this.controls.length > 0 &&
        WeixinJSBridge.invoke(
          'addMapControls',
          {
            mapId: this._mapId,
            controls: this._transformControls(this.controls)
          },
          function (e) {}
        ))
  },
  _insertIframeMap: function () {
    var self = this,
      map = (this._map = new qq.maps.Map(this.$.map, {
        zoom: this.scale,
        center: new qq.maps.LatLng(this.latitude, this.longitude),
        mapTypeId: qq.maps.MapTypeId.ROADMAP,
        zoomControl: !1,
        mapTypeControl: !1
      })),
      isDragging = !1,
      stopedDragging = !1
    qq.maps.event.addListener(map, 'click', function () {
      self.bindtap && wx.publishPageEvent(self.bindtap, {})
    })
    qq.maps.event.addListener(map, 'drag', function () {
      self.bindregionchange &&
        !isDragging &&
        (wx.publishPageEvent(self.bindregionchange, {
          type: 'begin'
        }),
          (isDragging = !0),
          (stopedDragging = !1))
    })
    qq.maps.event.addListener(map, 'dragend', function () {
      isDragging && ((isDragging = !1), (stopedDragging = !0))
    })
    qq.maps.event.addListener(map, 'bounds_changed', function () {
      self.bindregionchange &&
        stopedDragging &&
        (wx.publishPageEvent(self.bindregionchange, {
          type: 'end'
        }),
          (stopedDragging = !1))
    })
    var mapTitlesLoadedEvent = qq.maps.event.addListener(
      map,
      'tilesloaded',
      function () {
        self._mapId = __map_jssdk_id++
        self._ready()
        WeixinJSBridge.subscribe('doMapAction' + self._mapId, function (res) {
          if (self._map && self._mapId === res.data.mapId) {
            if (res.data.method === 'getMapCenterLocation') {
              var center = self._map.getCenter()
              WeixinJSBridge.publish('doMapActionCallback', {
                mapId: self._mapId,
                callbackId: res.data.callbackId,
                method: res.data.method,
                latitude: center.getLat(),
                longitude: center.getLng()
              })
            } else {
              res.data.method === 'moveToMapLocation' &&
                self.showLocation &&
                WeixinJSBridge.invoke('private_geolocation', {}, function (res) {
                  try {
                    res = JSON.parse(res)
                  } catch (e) {
                    res = {}
                  }
                  if (res.result && res.result.location) {
                    var loc = res.result.location
                    self._posOverlay && self._posOverlay.setMap(null)
                    self._posOverlay = new self.CustomOverlay(
                      new qq.maps.LatLng(loc.lat, loc.lng)
                    )
                    self._posOverlay.setMap(self._map)
                    self._map.panTo(new qq.maps.LatLng(loc.lat, loc.lng))
                  }
                })
            }
          }
        })
        WeixinJSBridge.publish('mapInsert', {
          domId: self.id,
          mapId: self._mapId,
          showLocation: self.showLocation,
          bindregionchange: self.bindregionchange,
          bindtap: self.bindtap
        })
        qq.maps.event.removeListener(mapTitlesLoadedEvent)
        mapTitlesLoadedEvent = null
      }
    )
    var CustomOverlay = (this.CustomOverlay = function (pos, idx) {
      this.index = idx
      this.position = pos
    })
    CustomOverlay.prototype = new qq.maps.Overlay()
    CustomOverlay.prototype.construct = function () {
      var div = (this.div = document.createElement('div'))
      div.setAttribute(
        'style',
        'width: 32px;height: 32px;background: rgba(31, 154, 228,.3);border-radius: 20px;position: absolute;'
      )
      var div2 = document.createElement('div')
      div2.setAttribute(
        'style',
        'position: absolute;width: 16px;height: 16px;background: white;border-radius: 8px;top: 8px;left: 8px;'
      )
      div.appendChild(div2)
      var div3 = document.createElement('div')
      div3.setAttribute(
        'style',
        'position: absolute;width: 12px;height: 12px;background: rgb(31, 154, 228);border-radius: 6px;top: 2px;left: 2px;'
      )
      div2.appendChild(div3)
      var panes = this.getPanes()
      panes.overlayMouseTarget.appendChild(div)
    }
    CustomOverlay.prototype.draw = function () {
      var projection = this.getProjection(),
        pixInfo = projection.fromLatLngToDivPixel(this.position),
        style = this.div.style
      ;(style.left = pixInfo.x - 16 + 'px'), (style.top = pixInfo.y - 16 + 'px')
    }
    CustomOverlay.prototype.destroy = function () {
      ;(this.div.onclick = null),
      this.div.parentNode.removeChild(this.div),
      (this.div = null)
    }
  },
  latitudeChanged: function (centerLatitude, ori) {
    if (centerLatitude) {
      this._isReady
        ? this._map.setCenter(
          new qq.maps.LatLng(centerLatitude, this.longitude)
        )
        : this._delay('latitudeChanged', centerLatitude, ori)
    }
  },
  longitudeChanged: function (centerLongitude, ori) {
    if (centerLongitude) {
      this._isReady
        ? this._map.setCenter(
          new qq.maps.LatLng(this.latitude, centerLongitude)
        )
        : this._delay('longitudeChanged', centerLongitude, ori)
    }
  },
  scaleChanged: function (scale = 16, ori) {
    if (scale) {
      this._isReady
        ? this._map.zoomTo(scale)
        : this._delay('scaleChanged', scale, ori)
    }
  },
  coversChanged: function (covers = [], ori) {
    var self = this
    if (this._isReady) {
      ;(this._covers || []).forEach(function (e) {
        e.setMap(null)
      })
      this._covers = covers.map(function (t) {
        var n = new qq.maps.Marker({
          position: new qq.maps.LatLng(t.latitude, t.longitude),
          map: self._map
        })
        t.iconPath && n.setIcon(new qq.maps.MarkerImage(t.iconPath))
        return n
      })
    } else {
      this._delay('coversChanged', covers, ori)
    }
  },
  markersChanged: function (markerArg = [], ori) {
    var self = this
    if (this._isReady) {
      ;(this._markers || []).forEach(function (e) {
        e.setMap(null)
      })
      this._markers = markerArg.map(function (markerItem) {
        var markerIns = new qq.maps.Marker({
          position: new qq.maps.LatLng(
            markerItem.latitude,
            markerItem.longitude
          ),
          map: self._map
        })
        markerItem.iconPath &&
          (Number(markerItem.width) && Number(markerItem.height)
            ? markerIns.setIcon(
              new qq.maps.MarkerImage(
                markerItem.iconPath,
                new qq.maps.Size(markerItem.width, markerItem.height),
                new qq.maps.Point(0, 0),
                new qq.maps.Point(markerItem.width / 2, markerItem.height),
                new qq.maps.Size(markerItem.width, markerItem.height)
              )
            )
            : markerIns.setIcon(new qq.maps.MarkerImage(markerItem.iconPath)))
        ;(markerItem.title || markerItem.name) &&
          markerIns.setTitle(markerItem.title || markerItem.name)
        self.bindmarkertap &&
          typeof markerItem.id !== 'undefined' &&
          qq.maps.event.addListener(markerIns, 'click', function (n) {
            var event = n.event
            event instanceof TouchEvent
              ? event.type === 'touchend' &&
                wx.publishPageEvent(self.bindmarkertap, {
                  markerId: markerItem.id
                })
              : wx.publishPageEvent(self.bindmarkertap, {
                markerId: markerItem.id
              })
          })
        return markerIns
      })
    } else {
      this._delay('markersChanged', markerArg, ori)
    }
  },
  linesChanged: function (lines = [], arg2) {
    var self = this
    if (this._isReady) {
      ;(this._lines || []).forEach(function (e) {
        e.setMap(null)
      })
      this._lines = lines.map(function (line) {
        var path = line.points.map(function (point) {
          return new qq.maps.LatLng(point.latitude, point.longitude)
        })
        return new qq.maps.Polyline({
          map: self._map,
          path: path,
          strokeColor: self._transformColor(line.color) || '',
          strokeWidth: line.width,
          strokeDashStyle: line.dottedLine ? 'dash' : 'solid'
        })
      })
    } else {
      this._delay('linesChanged', lines, arg2)
    }
  },
  circlesChanged: function (circles = [], ori) {
    var self = this
    if (this._isReady) {
      ;(this._circles || []).forEach(function (circle) {
        circle.setMap(null)
      })
      this._circles = circles.map(function (circle) {
        return new qq.maps.Circle({
          map: self._map,
          center: new qq.maps.LatLng(circle.latitude, circle.longitude),
          radius: circle.radius,
          fillColor: self._transformColor(circle.fillColor) || '',
          strokeColor: self._transformColor(circle.color) || '',
          strokeWidth: circle.strokeWidth
        })
      })
    } else {
      this._delay('circlesChanged', circles, ori)
    }
  },
  pointsChanged: function (points = [], ori) {
    var self = this
    if (!this._isReady) this._delay('pointsChanged', points, ori)
    ;(function () {
      if (points.length <= 0) {
        return
      }
      var LatLngBounds = new qq.maps.LatLngBounds()
      points.forEach(function (point) {
        LatLngBounds.extend(new qq.maps.LatLng(point.latitude, point.longitude))
      })
      self._map.fitBounds(LatLngBounds)
    })()
  },
  controlsChanged: function (nCtrl = [], n) {
    var self = this
    if (this._isReady) {
      ;(function () {
        for (
          var ctrs = (self._controls = self._controls || []);
          ctrs.length;

        ) {
          var ctr = ctrs.pop()
          ctr.onclick = null
          ctr.parentNode.removeChild(ctr)
        }
        nCtrl.forEach(function (ctr) {
          var img = document.createElement('img')
          img.style.position = 'absolute'
          img.style.left = ((ctr.position && ctr.position.left) || 0) + 'px'
          img.style.top = ((ctr.position && ctr.position.top) || 0) + 'px'
          img.style.width = ((ctr.position && ctr.position.width) || '') + 'px'
          img.style.height =
            ((ctr.position && ctr.position.height) || '') + 'px'
          img.style.zIndex = 9999
          img.src = ctr.iconPath
          ctr.clickable &&
            typeof ctr.id !== 'undefined' &&
            (img.onclick = function () {
              wx.publishPageEvent(self.bindcontroltap, {
                controlId: ctr.id
              })
            })
          ctrs.push(img)
          self.$.map.appendChild(img)
        })
      })()
    } else this._delay('controlsChanged', nCtrl, n)
  },
  showLocationChanged: function (location, uselessArg) {
    var self = this
    this._isReady
      ? (this._posOverlay &&
          (this._posOverlay.setMap(null), (this._posOverlay = null)),
        location &&
          WeixinJSBridge.invoke('private_geolocation', {}, function (res) {
            try {
              res = JSON.parse(res)
            } catch (e) {
              res = {}
            }
            if (res.result && res.result.location) {
              var loc = res.result.location
              ;(self._posOverlay = new self.CustomOverlay(
                new qq.maps.LatLng(loc.lat, loc.lng)
              )),
              self._posOverlay.setMap(self._map)
            }
          }))
      : this._delay('showLocationChanged', location, uselessArg)
    return void 0
  },
  attached: function () {
    if (this.latitude > 90 || this.latitude < -90) {
      console.group(new Date() + ' latitude 字段取值有误')
      console.warn('纬度范围 -90 ~ 90')
      return void console.groupEnd()
    } else if (this.longitude > 180 || this.longitude < -180) {
      console.group(new Date() + ' longitude 字段取值有误')
      console.warn('经度范围 -180 ~ 180')
      return void console.groupEnd()
    } else {
      this._canInvokeNewFeature = !0
      this._box = this._getBox()
      window.__map_jssdk_ready
        ? this._insertIframeMap()
        : window.__map_jssdk_callback.push(this._insertIframeMap.bind(this))
      return void 0
    }
  },
  detached: function () {}
})
