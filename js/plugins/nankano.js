class Landscape
  constructor: (options={}) ->
    $('body').css visibility: 'hidden'

    @isPortraitActivated = false
    @isLandscape = false
    @winWidth = 0
    @clientHeight = 0
    @clientWidth = 0
    @maxWidth = 0
    @dx = 0

    @onTouchCurrent = {x: 0, y: 0}
    @onTouchStart = {x: 0, y: 0}
    @onTouchDrag = {x: 0, y: 0}

    @onTouchQueue = []
    @onTouchTimer = null
    @onTouchDragThres = 5
    # @onTouchScrollThres = 100
    @onTouchScrollThres = 0
    @onTouchScrollThresFlg = false

    @$Landscape = $('#Landscape')
    @$wrapper = $('#wrapper')
    @$viewHost = $('.view-host')
    @$view = $('.view')

    @$fullImg = $('.full-image')

    @$wrapper.css
      'overflow': 'hidden'

    @$viewHost.css
      WebkitTransform: 'translate3d(0,0,0)'
      WebkitTransitionProperty: '-webkit-transform'
      WebkitTransformStyle: 'preserve-3d'

    flg = @orientation()
    @css()
    $('body').css visibility: 'visible'

    unless flg
      $('.no-mobile').css display: 'block'
      return

    $('body').imagesLoaded =>
      @setFullImg()
      @setView()
      @iphoneHack()

      @onTouch()

    # Bind event for orientationchange
    @orientationchange()

    return


  onTouch: () ->
    @touchstart()
    @touchmove()
    @touchend()
    return

  touchstart: () ->
    @$viewHost.on 'touchstart', (e) =>
      if $(window).scrollTop() < 1
        scrollTo(0,1)

      if event.touches[1]?
        e.preventDefault()
        return

      @dx = 0

      touch = event.touches[0]
      @onTouchCurrent = @getTranslate(@$viewHost)
      @onTouchStart = {x: touch.pageX, y: touch.pageY}
      @onTouchDrag = {x: touch.pageX, y: touch.pageY}

      @onTouchQueue.push @dispatcher
      @onTouchTimer = setTimeout =>
        if @onTouchQueue.length > 0
          @onTouchQueue.shift()
      , 300

    return


  touchmove: () ->
    @$viewHost.on 'touchmove', (e) =>
      e.preventDefault()

      if event.touches[1]?
        return

      touch = event.touches[0]
      @onTouchDrag = {x: touch.pageX, y: touch.pageY}

      if @isLandscape
        @dx = @onTouchDrag.x - @onTouchStart.x
      else
        @dx = @onTouchDrag.y - @onTouchStart.y

      @scroll()

    return

  touchend: () ->
    @$viewHost.on 'touchend', (e) =>
      if event.touches[1]?
        e.preventDefault()
        return
      setTimeout =>
        @scrollFix()
      , 10

      if @onTouchQueue.length > 0
        clearTimeout @onTouchTimer
        f = @onTouchQueue.shift()
        f()

    return


  dispatcher: () =>
    absX = Math.abs @dx
    if absX < @onTouchDragThres
      return

    @scroll(1000, 3.0)
    setTimeout =>
      @scrollFix()
    , 800

    return

  scroll: (duration = 10, ratio = 1.0) ->
    x = @onTouchCurrent.x + ratio * @dx
    thres = -1 * @maxWidth + @clientWidth - @onTouchScrollThres

    if x > @onTouchScrollThres
      x = @onTouchScrollThres
    else if x < thres
      x = thres

    @$viewHost.css
      WebkitTransitionDuration: duration + 'ms'
      WebkitTransform: "translate3d(#{x}px, 0px, 0px)"
      WebkitTransitionTimingFunction: "cubic-bezier(0, 0.75, 0.25, 1.0)"

    return

  scrollFix: () ->
    flg = false
    pos = @getTranslate(@$viewHost)
    x = pos.x

    thres = -1 * @maxWidth + @clientWidth

    if x > 0
      x = 0
      flg = true
    else if x < thres
      x = thres
      flg = true


    if flg
      @$viewHost.css
        WebkitTransitionDuration: '325ms'
        WebkitTransform: "translate3d(#{x}px, 0px, 0px)"
        WebkitTransitionTimingFunction: "cubic-bezier(0.42, 0, 0.58, 1.0)"

    return

  css: () ->
    @clientHeight = document.documentElement.clientHeight + 15 + 44  # iphoneHack

    $('body').css
      'min-height': @clientHeight
      'max-height': @clientHeight
    @$Landscape.css
      'min-height': @clientHeight
      'max-height': @clientHeight

    @$viewHost.css
      'min-height': @clientHeight
      'max-height': @clientHeight

    return

  setView: () ->
    w = 0
    @$view.each () ->
      $(@).css
        left: w
      w += $(@).outerWidth()
    @maxWidth = w

    @$viewHost.width @maxWidth

    return

  setFullImg: () ->
    self = @

    @$fullImg.each () ->
      _img = new Image()
      _img.src = $(@).find('img').attr('src')
      _w = _img.width
      _h = _img.height

      if self.isLandscape
        _height = self.clientHeight
      else
        _height = self.winWidth

      _width = parseInt(_height / _h * _w) + 1

      $(@).width _width

    return

  orientation: () ->
    unless window.orientation?
      return false

    @setWinWidth()
    switch Math.abs(window.orientation)
      when 0  # Portrait
        unless @isPortraitActivated
          @setTransformOrigin(@$wrapper)
          @isPortraitActivated = true
        @isLandscape = false
        @rotate(@$wrapper, 90)

        $('body').addClass 'portrait'
        $('body').removeClass 'landscape'

        @clientHeight = @winWidth
        @clientWidth = document.documentElement.clientHeight + 15 + 44

      when 90  # Landscape
        @isLandscape = true
        @rotate(@$wrapper, 0)

        $('body').addClass 'landscape'
        $('body').removeClass 'portrait'

        @clientHeight = document.documentElement.clientHeight + 15 + 44
        @clientWidth = @winWidth

    @$wrapper.height @clientHeight
    @$wrapper.width @clientWidth

    return true


  setTransformOrigin: ($elem) ->
    # @setWinWidth()
    o = @winWidth / 2

    $elem.css
      WebkitTransformOrigin: "#{o}px #{o}px"

    return

  setWinWidth: () ->
    @winWidth = $(window).width()
    return

  orientationchange: () ->
    $(window).on 'orientationchange', (e) =>
      @orientation()
      @css()
      @setFullImg()
      @setView()
      @transThres()
      @iphoneHack()
    return

  transThres: () ->
    pos = @getTranslate(@$viewHost)
    x = pos.x

    thres = -1 * @maxWidth + @clientWidth

    if x > 0
      x = 0
    if x < thres
      x = thres

    @$viewHost.css
      WebkitTransitionDuration: '0ms'
      WebkitTransform: "translate3d(#{x}px, 0px, 0px)"
      WebkitTransitionTimingFunction: "cubic-bezier(0, 0.75, 0.25, 1.0)"

    return

  rotate: ($elem, deg) ->
    $elem.css
      WebkitTransform: "rotate(#{deg}deg)"

    return

  getTranslate: ($elem) ->
    m = new WebKitCSSMatrix($elem.css('-webkit-transform'))
    return { x: parseInt(m.e, 10), y: parseInt(m.f, 10) }


  iphoneHack: () ->
    setTimeout(scrollTo, 120, 0, 1)
    return



$ ->
  new Landscape()