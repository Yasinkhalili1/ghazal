//!وظیفش اینکه اطلاعات مربوط به خواننده و وظایف مرتبط با خواننده رو بگیره و اجرا کنه
class Singer {
  constructor(
    nameSinger,
    followers,
    following,
    favoriteRate,
    viewMusic,
    profileUrl,
    coverUrl,
    songs,
    singerList,
  ) {
    this.id = Math.ceil(new Date().getTime() * Math.random());
    this.nameSinger = nameSinger;
    this.followers = followers;
    this.following = following;
    this.favoriteRate = favoriteRate;
    this.viewMusic = viewMusic;
    this.profileUrl = profileUrl;
    this.coverUrl = coverUrl;
    this.songs = songs;
    this.singerList = singerList;
  }

  //!Create Singer Page FUNC
  showSingerInfo(singer) {
    const coverSinger = document.querySelector(".singer__cover");
    const profileSinger = document.querySelector(".singer__profile-box");
    const nameSinger = document.querySelector(".singer__profile-title");
    const followersSinger = document.getElementById("Followers");
    const followingSinger = document.getElementById("following");
    const favoriteSinger = document.getElementById("favorite");
    const viewSinger = document.getElementById("viewMusic");
    const musicList = document.getElementById("MusicList");
    //!Add Cover
    coverSinger.innerHTML = `<img
      class="singer__cover-image"
      src="${singer.coverUrl}" />`;

    //!Add Profile
    profileSinger.innerHTML = `<img
      class="singer__profile-img"
      src="${singer.profileUrl}" />`;

    //!Change Name
    nameSinger.textContent = singer.nameSinger;

    //!Change Info
    followersSinger.textContent = singer.followers;
    followingSinger.textContent = singer.following;
    favoriteSinger.textContent = singer.favoriteRate;
    viewSinger.textContent = singer.viewMusic;

    //!Music List Info
    musicList.innerHTML = "";
    singer.songs.forEach((sound) => {
      const createItemElm = document.createElement("li");
      createItemElm.className = "main__content-item";
      createItemElm.innerHTML = `<div class="main__content-details">
      <div class="main__content-box">
        <div class="main__content-img">
          <img
            class="main__content-pic"
            src="${sound.cover}" />
          <div class="main__content-play plays${sound.id}">
                      <i
                        class="fa-solid fa-play play${sound.id} main__content-play-icon icon-play"></i>
                      <i
                        class="fa-solid fa-pause play${sound.id} main__content-play-icon icon-pause"></i>
                    </div>
        </div>
        <span class="main__content-text">${sound.name}</span>
      </div>
      <div class="main__content-times">
        <span class="main__content-time">${sound.time}</span>
      </div>
      <div class="main__content-times">
        <span class="main__content-time">$${sound.price}</span>
      </div>
    </div>
    <div class="main__content-cart">
          <div class="main__content-times card${sound.id}">
           <span class="main__content-card">افزودن به سبد</span>
         </div>
         <div class="main__content-times favorite${sound.id}">
           <i class="fa-regular fa-heart main__content-icon"></i>
         </div>
         <button class="main__content-share" data-name="${sound.name}" data-artist="${singer.nameSinger}" title="اشتراک‌گذاری">
           <i class="fa-solid fa-share-nodes"></i>
         </button>
         <div class="main__content-download" data-src="${sound.source}" data-name="${sound.name}" title="دانلود رایگان">
           <i class="fa-solid fa-download"></i>
         </div>
       </div>`;
      musicList.append(createItemElm);

      //!Event Play Music
      const playIcon = createItemElm.querySelector(`.plays${sound.id}`);
      playIcon.addEventListener("click", () => {
        this.playMusic(sound.source, sound.id);
      });

      //!Event Add To Card
      const cardIcon = createItemElm.querySelector(`.card${sound.id}`);
      cardIcon.addEventListener("click", () => {
        this.addToCard(sound.id, singer.id);
      });

      //!Event Add To Favorite
      const favoriteIcon = createItemElm.querySelector(`.favorite${sound.id}`);
      favoriteIcon.addEventListener("click", () => {
        this.addToFavorite(sound.id, singer.id);
      });

      //!Share button → open popover with options
            const shareBtn = createItemElm.querySelector(".main__content-share");
            shareBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              MyApp.sharePopover.open(
                rect.left,
                rect.bottom + 6,
                sound.name,
                singer.nameSinger,
              );
            });

      //!Download demo
      const downloadBtn = createItemElm.querySelector(
        ".main__content-download",
      );
      downloadBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = sound.source;
        a.download = sound.name + ".mp3";
        document.body.appendChild(a);
        a.click();
        a.remove();
        new Toast("دانلود دمو شروع شد").success();
      });
    });
  }

  //!Find Singer Func
  findSingerFunc(singerId) {
    return this.singerList.singers.find((event) => event.id == singerId);
  }

  findsSounds(soundId, singerId) {
    const findSinger = this.findSingerFunc(singerId);
    return findSinger.songs.find((event) => event.id == soundId);
  }

  //!Add To Card FUNC
  addToCard(soundId, singerId) {
    const findSounds = this.findsSounds(soundId, singerId);
    MyApp.getCard().add(findSounds);
  }

  //!Add To Favorite FUNC
  addToFavorite(soundId, singerId) {
    const findSounds = this.findsSounds(soundId, singerId);
    MyApp.getFavorite().add(findSounds);
  }

  //!Play Music FUNC
  playMusic(source, id) {
    //!Find current song meta from singer list
    const currentSinger = this.singerList ? this.singerList.singers : [];
    let meta = { title: "—", artist: "—", cover: "" };
    currentSinger.forEach((singer) => {
      const found = singer.songs.find((s) => s.id == id);
      if (found) {
        meta = {
          title: found.name,
          artist: singer.nameSinger,
          cover: found.cover,
        };
      }
    });
    //!Add to queue + play via central player
    MyApp.player.addToQueue({
      id,
      source,
      meta,
    });
    MyApp.player.play(source, id, meta);

    //!Toggle play/pause icons on the song list
    const clickedBtn = document.querySelector(`.plays${id}`);
    const isSameTrack = MyApp.player.audio.src.endsWith(source);
    if (isSameTrack) {
      //!Same track clicked: sync list button with actual audio state
      if (clickedBtn) {
        clickedBtn.classList.toggle("playing", !MyApp.player.audio.paused);
      }
    } else {
      //!New track: reset all, mark current
      document.querySelectorAll(".main__content-play").forEach((b) => {
        b.classList.remove("playing");
      });
      if (clickedBtn) clickedBtn.classList.add("playing");
    }
  }

  //!create Singer Click Handler
  createSingerClickHandler(singerId) {
    const musicList = document.getElementById("MusicList");
    const findSinger = this.findSingerFunc(singerId);
    //!Empty Music List
    musicList.innerHTML = "";
    this.showSingerInfo(findSinger);
  }

  //!Other Singer Info FUNC
  otherSingerInfo(allSingerInfo) {
    const swiperList = document.getElementById("swiper-wrapper");
    swiperList.innerHTML = "";
    allSingerInfo.forEach((singer, index) => {
      const createSingerElm = document.createElement("div");
      ((createSingerElm.className = "swiper-slide main__swipper-slide"),
        (createSingerElm.innerHTML = `<img
      class="w-100 main__swipper-img"
      src="${singer.profileUrl}"/>`));
      swiperList.append(createSingerElm);

      //!Active Shadmehr (default singer) if present, else first element
            if (singer.nameSinger.includes("شادمهر")) {
              createSingerElm.classList.add("active");
            }
      createSingerElm.addEventListener("click", (event) => {
        this.createSingerClickHandler(singer.id);
        const allSlide = document.querySelectorAll(".main__swipper-img");
        //!Delete Active classs
        allSlide.forEach((slide) => {
          slide.parentElement.classList.remove("active");
        });
        //!Add Active Class
        event.target.parentElement.classList.add("active");
        //!Open singer detail modal
        const theSinger = this.findSingerFunc(singer.id);
        if (MyApp.singerModal && theSinger) {
          MyApp.singerModal.open(theSinger);
        }
      });
    });
    //!swiper update fix slider bug
        if (window.swiper) {
          window.swiper.update();
          //!Move swiper to Shadmehr slide (default singer)
          const shadIdx = allSingerInfo.findIndex((s) =>
            s.nameSinger.includes("شادمهر"),
          );
          if (shadIdx > 0) {
            window.swiper.slideTo(shadIdx, 0);
          }
        }
      }
    }

//!کل کارهای مربوط به سبد خرید به عهده این کلاس می باشد
class Basket {
  constructor() {
    this.basketArrays = new Set([]);
    this.nameCookie = "basketCookie";
    this.expireCookie = 24 * 3600;
    this.getFromCookie();
  }

  findBasket(basketId) {
    //!Fix: return was missing — basket duplicate check never worked
    return Array.from(this.basketArrays).find((event) => {
      return event.id == basketId;
    });
  }

  add(sound) {
    const existing = this.findBasket(sound.id);
    if (!existing) {
      //!New item: add with quantity 1
      const newItem = { ...sound, quantity: 1 };
      this.basketArrays.add(newItem);
      new Toast("به سبد خرید اضافه شد").success();
    } else {
      //!Existing: increase quantity
      existing.quantity = (existing.quantity || 1) + 1;
      new Toast("تعداد افزایش یافت").success();
    }
    this.showCard();
    this.calculateTotalPrice();
    this.setToCookie();
  }

  //!Increase quantity
  increaseQuantity(musicId) {
    const item = this.findBasket(musicId);
    if (!item) return;
    item.quantity = (item.quantity || 1) + 1;
    this.showCard();
    this.calculateTotalPrice();
    this.setToCookie();
  }

  //!Decrease quantity (remove if 0)
  decreaseQuantity(musicId) {
    const item = this.findBasket(musicId);
    if (!item) return;
    item.quantity = (item.quantity || 1) - 1;
    if (item.quantity <= 0) {
      this.basketArrays.delete(item);
      new Toast("از سبد خرید حذف شد").danger();
    }
    this.showCard();
    this.calculateTotalPrice();
    this.setToCookie();
  }

  setToCookie() {
    document.cookie = `${this.nameCookie}=${JSON.stringify(Array.from(this.basketArrays))};max-age=${this.expireCookie}`;
  }

  getFromCookie() {
    const getCookie = document.cookie;
    if (getCookie) {
      const splitCookie = getCookie.split(";");
      const getData = splitCookie.map((data) => {
        return data.trim();
      });
      const index = getData.findIndex((event) =>
        event.includes(`${this.nameCookie}`),
      );
      if (index !== -1) {
        const parseCookie = JSON.parse(getData[index].split("=")[1]);
        parseCookie.forEach((event) => {
          this.add(event);
        });
      }
    }
  }

  //!showCard FUNC
  showCard() {
    const basketList = document.querySelector(".header__card-box");
    const basketLength = document.querySelector(".header__links-text");

    //!Empty Basket List
    basketList.innerHTML = "";

    //!show Item Basket
    this.basketArrays.forEach((basket) => {
      const musicItemElem = document.createElement("div");
      const qty = basket.quantity || 1;
      musicItemElem.className = `header__card-item item${basket.id}`;
      musicItemElem.innerHTML = `<div class="header__card-info">
      <img class="header__card-img" src="${basket.cover}">
      <span class="header__card-text">${basket.name}</span>
    </div>
    <div class="header__card-qty">
      <button class="header__card-qty-btn" data-act="dec" data-id="${basket.id}">−</button>
      <span class="header__card-qty-value">${qty}</span>
      <button class="header__card-qty-btn" data-act="inc" data-id="${basket.id}">+</button>
    </div>
    <span class="header__card-price">$${basket.price * qty}</span>`;
      basketList.prepend(musicItemElem);

      //!+ / − buttons (stopPropagation so click on item doesn't remove)
      musicItemElem.querySelectorAll(".header__card-qty-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = e.currentTarget.dataset.id;
          if (e.currentTarget.dataset.act === "inc") {
            this.increaseQuantity(id);
          } else {
            this.decreaseQuantity(id);
          }
        });
      });

      //!Click on item → remove
      musicItemElem.addEventListener("click", (event) => {
        const musicIdElm = event.currentTarget.classList[1].slice(4);
        this.removeCard(musicIdElm);
      });
    });

    //!show Size Basket (total quantity)
    let totalQty = 0;
    this.basketArrays.forEach((b) => {
      totalQty += b.quantity || 1;
    });
    basketLength.textContent = totalQty;
  }

  //!Remove Card Music FUNC
  removeCard(musicId) {
    const findMusicCard = Array.from(this.basketArrays).find(
      (item) => item.id == musicId,
    );
    if (findMusicCard) {
      this.basketArrays.delete(findMusicCard);
      this.showCard();
      this.calculateTotalPrice();
      this.setToCookie();
      new Toast("از سبد خرید حذف شد").danger();
    }
  }

  //!Calculate Total Price Func
  calculateTotalPrice() {
    const totalPriceElm = document.querySelector(".header__card-total-value");
    const convertBasket = Array.from(this.basketArrays);
    const totalPrice = convertBasket.reduce((prevValue, currentValue) => {
      const qty = currentValue.quantity || 1;
      return prevValue + currentValue.price * qty;
    }, 0);

    totalPriceElm.textContent = `$${totalPrice}`;
  }
}

class Toast {
  toastElm;
  text;
  toastMessage;

  constructor(text) {
    this.toastMessage = document.getElementById("toastMessage");
    this.text = text;
    this.createElement();
  }

  createElement() {
    this.toastElm = document.createElement("div");
    this.toastElm.classList.add("Toast");
    this.toastElm.textContent = this.text;
  }

  danger() {
    this.toastElm.setAttribute("id", "delToast");
    this.toastMessage.append(this.toastElm);
    this.remove();
  }
  success() {
    this.toastElm.setAttribute("id", "addToast");
    this.toastMessage.append(this.toastElm);
    this.remove();
  }

  remove() {
    setTimeout(() => {
      this.toastElm.remove();
    }, 2000);
  }
}

class Favorite {
  constructor() {
    this.favoriteList = new Set([]);
    this.nameStorage = "favoriteStorage";
    this.getFroamLocalFavorite();
  }

  findFavorite(favoriteId) {
      return Array.from(this.favoriteList).find((event) => {
        return event.id == favoriteId;
      });
    }

  add(favorite) {
    if (!this.findFavorite(favorite.id)) {
      this.favoriteList.add(favorite);
      this.showFavorite();
      this.setToLocalFavorite();
      new Toast("به علاقه‌مندی‌ها اضافه شد").success();
    } else {
      new Toast("این آهنگ قبلاً در علاقه‌مندی‌هاست").danger();
    }
  }

  setToLocalFavorite() {
    localStorage.setItem(
      this.nameStorage,
      JSON.stringify(Array.from(this.favoriteList)),
    );
  }

  getFroamLocalFavorite() {
    const getStorage = localStorage.getItem(this.nameStorage);
    if (getStorage) {
      try {
        const parseStorage = JSON.parse(getStorage);
        parseStorage.forEach((event) => {
          this.add(event);
        });
      } catch (e) {
        //!Safe: invalid localStorage JSON → clear and start fresh
        localStorage.removeItem(this.nameStorage);
      }
    }
  }

  //!show Favorite FUNC
  showFavorite() {
    const favoriteElm = document.querySelector(".main__content-inside");

    //!Empty Basket List
    favoriteElm.innerHTML = "";

    //!show Item Basket
    this.favoriteList.forEach((favorite) => {
      const favoriteItemElem = document.createElement("div");
      favoriteItemElem.className = `main__content-singer item${favorite.id}`;
      favoriteItemElem.innerHTML = `
    <img class="main__content-singer-img"
     src="${favorite.cover}">
    <span class="main__content-singer-delete">حذف از علاقه‌مندی‌ها</span>`;

      favoriteElm.prepend(favoriteItemElem);

      favoriteItemElem.addEventListener("click", (event) => {
        const favoriteIdElm = event.currentTarget.classList[1].slice(4);
        this.removeFavorite(favoriteIdElm);
      });
    });

    //!Text Favorite
    if (this.favoriteList.size == 0) {
      favoriteElm.textContent = "چیزی برای نمایش نیست";
    }
  }

  //!Remove Favorite Music FUNC
  removeFavorite(musicId) {
    const findMusicFavorite = Array.from(this.favoriteList).find(
      (item) => item.id == musicId,
    );
    this.favoriteList.delete(findMusicFavorite);
    this.showFavorite();
    this.setToLocalFavorite();
    new Toast("از علاقه‌مندی‌ها حذف شد").danger();
  }
}

//!ذخیره اطلاعات خواننده ها داخل آرایه
class SingerList {
  constructor() {
    this.singers = [];
  }

  addSinger(
    nameSinger,
    followers,
    following,
    favoriteRate,
    viewMusic,
    profileUrl,
    coverUrl,
    songs,
  ) {
    const newSinger = new Singer(
      nameSinger,
      followers,
      following,
      favoriteRate,
      viewMusic,
      profileUrl,
      coverUrl,
      songs,
      this,
    );
    this.singers.push(newSinger);
          }
}

//!وظیفش اینکه کارهایی که در شروع نیاز داریم رو انجام بده + وظایف Html
class Sound {
  constructor() {
    this.singerList = new SingerList();
    this.basket = new Basket();
    this.favorite = new Favorite();
    this.generateSingerList();

    this.showCardClickHandler();
    this.initNewsletter();
    this.initSearch();
    this.initPlayAll();
    this.initFilters();
  }

  generateSingerList() {
      //!Load singers from data.js only
      const baseData = window.GHAZAL_DATA || [];

      baseData.forEach((singer) => {
              this.singerList.addSinger(
                singer.nameSinger,
                singer.followers,
                singer.following,
                singer.favoriteRate,
                singer.viewMusic,
                singer.profileUrl,
                singer.coverUrl,
                singer.songs,
              );
            });

            //!Build swiper (once, with all singers)
            if (this.singerList.singers[0]) {
              this.singerList.singers[0].otherSingerInfo(this.singerList.singers);
            }

    //!Fill stats for songs missing them (views/sold/rating)
        const seed = 12345;
        this.singerList.singers.forEach((singer) => {
          singer.songs.forEach((song) => {
            if (song.views === undefined) {
              song.views = 50000 + ((song.id * seed) % 450000);
            }
            if (song.sold === undefined) {
              song.sold = 20 + ((song.id * 7) % 180);
            }
            if (song.rating === undefined) {
              song.rating = 3 + ((song.id * 13) % 20) / 10;
            }
          });
        });

        //!Show Shadmehr (شادمهر) by default on page load
        const shadmehr = this.singerList.singers.find(
          (s) => s.nameSinger.includes("شادمهر"),
        );
        if (shadmehr) {
          shadmehr.showSingerInfo(shadmehr);
        }
      }

  showCardClickHandler() {
    const basketElm = document.querySelector(".header__links-shop");
    const basketBox = document.querySelector(".header__card");

    basketElm.addEventListener("click", () => {
      basketBox.classList.toggle("hidden");
    });
  }

  //!Newsletter form handler
  initNewsletter() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletterEmail");
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        new Toast("لطفاً ایمیل خود را وارد کنید").danger();
        return;
      }
      if (!emailRegex.test(email)) {
        new Toast("فرمت ایمیل صحیح نیست").danger();
        return;
      }
      //!Just a demo — no backend connected yet
      new Toast("عضویت شما با موفقیت ثبت شد").success();
      form.reset();
    });
  }

  //!Play all songs from ALL singers in queue
  playAll() {
    const tracks = [];
    this.singerList.singers.forEach((singer) => {
      if (!singer.songs) return;
      singer.songs.forEach((song) => {
        tracks.push({
          id: song.id,
          source: song.source,
          meta: {
            title: song.name,
            artist: singer.nameSinger,
            cover: song.cover,
          },
        });
      });
    });
    if (tracks.length === 0) return;
    MyApp.player.setQueue(tracks);
    MyApp.player.play(tracks[0].source, tracks[0].id, tracks[0].meta);
    new Toast(`پخش همه آهنگ‌ها (${tracks.length} آهنگ) شروع شد`).success();
  }

  initPlayAll() {
    const btn = document.getElementById("playAllBtn");
    if (!btn) return;
    btn.addEventListener("click", () => this.playAll());
  }

  //!===== Filters (all / popular / bestseller) =====
  //!Collect all songs across singers with metadata
  collectAllSongs() {
    const results = [];
    this.singerList.singers.forEach((singer) => {
      singer.songs.forEach((song) => {
        results.push({ song, singerName: singer.nameSinger });
      });
    });
    return results;
  }

  //!Render a generic list of {song, singerName} into MusicList
  renderSongs(results) {
    const musicList = document.getElementById("MusicList");
    musicList.innerHTML = "";
    if (results.length === 0) {
      musicList.innerHTML =
        '<li class="main__content-item main__content-empty">چیزی پیدا نشد</li>';
      return;
    }
    results.forEach(({ song, singerName }) => {
      const li = document.createElement("li");
      li.className = "main__content-item";
      li.innerHTML = `
                <div class="main__content-details">
                  <div class="main__content-box">
                    <div class="main__content-img">
                      <img class="main__content-pic" src="${song.cover}" />
                      <div class="main__content-play plays${song.id}">
                        <i class="fa-solid fa-play play${song.id} main__content-play-icon icon-play"></i>
                        <i class="fa-solid fa-pause play${song.id} main__content-play-icon icon-pause"></i>
                      </div>
                    </div>
                    <span class="main__content-text">${song.name}</span>
                    <div class="main__stars" data-song-id="${song.id}">
                      ${this.starsHtml(song.id)}
                    </div>
                  </div>
                  <div class="main__content-times">
                    <span class="main__content-time">${song.time}</span>
                  </div>
                  <div class="main__content-times">
                    <span class="main__content-time">$${song.price}</span>
                  </div>
                </div>
                <div class="main__content-cart">
                                  <div class="main__content-times card${song.id}">
                                    <span class="main__content-card">افزودن به سبد</span>
                                  </div>
                                  <div class="main__content-times favorite${song.id}">
                                    <i class="fa-regular fa-heart main__content-icon"></i>
                                  </div>
                                  <button class="main__content-share" data-name="${song.name}" data-artist="${singerName}" title="اشتراک‌گذاری">
                                    <i class="fa-solid fa-share-nodes"></i>
                                  </button>
                                  <div class="main__content-download" data-src="${song.source}" data-name="${song.name}" title="دانلود رایگان">
                                    <i class="fa-solid fa-download"></i>
                                  </div>
                                </div>`;
      musicList.append(li);

      //!Bind star rating events
      this.bindStarEvents(li, song.id);

      li.querySelector(`.plays${song.id}`).addEventListener("click", () => {
        MyApp.player.addToQueue({
          id: song.id,
          source: song.source,
          meta: { title: song.name, artist: singerName, cover: song.cover },
        });
        MyApp.player.play(song.source, song.id, {
          title: song.name,
          artist: singerName,
          cover: song.cover,
        });
      });
      li.querySelector(`.card${song.id}`).addEventListener("click", () => {
        MyApp.getCard().add(song);
      });
      li.querySelector(`.favorite${song.id}`).addEventListener("click", () => {
        MyApp.getFavorite().add(song);
      });
      //!Share button → open popover with options
            li.querySelector(".main__content-share").addEventListener("click", (e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              MyApp.sharePopover.open(
                rect.left,
                rect.bottom + 6,
                song.name,
                singerName,
              );
            });
      //!Download demo button
      li.querySelector(".main__content-download").addEventListener(
        "click",
        () => {
          const a = document.createElement("a");
          a.href = song.source;
          a.download = song.name + ".mp3";
          document.body.appendChild(a);
          a.click();
          a.remove();
          new Toast("دانلود دمو شروع شد").success();
        },
      );
    });
  }

  initFilters() {
      const filterElm = document.getElementById("mainFilters");
      if (!filterElm) return;
      filterElm.querySelectorAll(".main__filter").forEach((btn) => {
        btn.addEventListener("click", () => {
          filterElm.querySelectorAll(".main__filter").forEach((b) => {
            b.classList.toggle("active", b === btn);
          });
          const filter = btn.dataset.filter;
          let results = this.collectAllSongs();
          if (filter === "popular") {
            results.sort((a, b) => (b.song.views || 0) - (a.song.views || 0));
          } else if (filter === "bestseller") {
            results.sort((a, b) => (b.song.sold || 0) - (a.song.sold || 0));
          }
          //!Re-render list
          this.renderSongs(results);
          //!Sync active state from footer link
          this.syncFilterUI(filter);
        });
      });
    }

    //!Keep filter buttons & footer links in sync
    syncFilterUI(filter) {
      document.querySelectorAll(".main__filter").forEach((b) => {
        b.classList.toggle("active", b.dataset.filter === filter);
      });
    }

  //!===== Star Rating =====
  //!Get saved rating from localStorage
  getRating(songId) {
    try {
      const ratings = JSON.parse(localStorage.getItem("ghazalRatings")) || {};
      return ratings[songId] || 0;
    } catch {
      return 0;
    }
  }

  saveRating(songId, value) {
    try {
      const ratings = JSON.parse(localStorage.getItem("ghazalRatings")) || {};
      ratings[songId] = value;
      localStorage.setItem("ghazalRatings", JSON.stringify(ratings));
    } catch (e) {}
  }

  //!HTML for 5 stars
  starsHtml(songId) {
    const r = this.getRating(songId);
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<span class="main__star ${i <= r ? "filled" : ""}" data-val="${i}">★</span>`;
    }
    return html;
  }

  //!Bind click on stars in a list item
  bindStarEvents(li, songId) {
    li.querySelectorAll(
      `.main__stars[data-song-id="${songId}"] .main__star`,
    ).forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.dataset.val, 10);
        this.saveRating(songId, value);
        //!Re-render stars
        const starsBox = li.querySelector(
          `.main__stars[data-song-id="${songId}"]`,
        );
        starsBox.innerHTML = this.starsHtml(songId);
        new Toast(`امتیاز ${value} از ۵ ثبت شد`).success();
        this.bindStarEvents(li, songId);
      });
    });
  }

  //!Search songs & singers
  initSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        //!Empty → show first singer again
        const first = this.singerList.singers[0];
        if (first) first.showSingerInfo(first);
        return;
      }

      //!Collect matching songs across all singers
      const results = [];
      this.singerList.singers.forEach((singer) => {
        singer.songs.forEach((song) => {
          const inName = song.name.toLowerCase().includes(query);
          const inArtist = singer.nameSinger.toLowerCase().includes(query);
          if (inName || inArtist) {
            results.push({ song, singerName: singer.nameSinger });
          }
        });
      });

      //!Render results
      const musicList = document.getElementById("MusicList");
      musicList.innerHTML = "";
      if (results.length === 0) {
        musicList.innerHTML =
          '<li class="main__content-item main__content-empty">چیزی پیدا نشد</li>';
        return;
      }

      results.forEach(({ song, singerName }) => {
        const li = document.createElement("li");
        li.className = "main__content-item";
        li.innerHTML = `
              <div class="main__content-details">
                <div class="main__content-box">
                  <div class="main__content-img">
                                      <img class="main__content-pic" src="${song.cover}" />
                                      <div class="main__content-play plays${song.id}">
                                        <i class="fa-solid fa-play play${song.id} main__content-play-icon icon-play"></i>
                                        <i class="fa-solid fa-pause play${song.id} main__content-play-icon icon-pause"></i>
                                      </div>
                                    </div>
                                    <span class="main__content-text">${song.name}</span>
                                    <div class="main__stars" data-song-id="${song.id}">
                                      ${this.starsHtml(song.id)}
                                    </div>
                                  </div>
                <div class="main__content-times">
                  <span class="main__content-time">${song.time}</span>
                </div>
                <div class="main__content-times">
                                  <span class="main__content-time">$${song.price}</span>
                                </div>
                              </div>
                              <div class="main__content-cart">
                                <div class="main__content-times card${song.id}">
                                  <span class="main__content-card">افزودن به سبد</span>
                                </div>
                                <div class="main__content-times favorite${song.id}">
                                  <i class="fa-regular fa-heart main__content-icon"></i>
                                </div>
                                <button class="main__content-share" data-name="${song.name}" data-artist="${singerName}" title="اشتراک‌گذاری">
                                  <i class="fa-solid fa-share-nodes"></i>
                                </button>
                                <div class="main__content-download" data-src="${song.source}" data-name="${song.name}" title="دانلود رایگان">
                                  <i class="fa-solid fa-download"></i>
                                </div>
                              </div>`;
        musicList.append(li);

        li.querySelector(`.plays${song.id}`).addEventListener("click", () => {
          this.singerList.singers.forEach((s) => {
            const found = s.songs.find((x) => x.id == song.id);
            if (found) {
              MyApp.player.addToQueue({
                id: song.id,
                source: song.source,
                meta: {
                  title: song.name,
                  artist: s.nameSinger,
                  cover: song.cover,
                },
              });
              MyApp.player.play(song.source, song.id, {
                title: song.name,
                artist: s.nameSinger,
                cover: song.cover,
              });
            }
          });
        });
        li.querySelector(`.card${song.id}`).addEventListener("click", () => {
          MyApp.getCard().add(song);
        });
        li.querySelector(`.favorite${song.id}`).addEventListener(
          "click",
          () => {
            MyApp.getFavorite().add(song);
          },
        );
        //!Share button → open popover with options
                li.querySelector(".main__content-share").addEventListener(
                  "click",
                  (e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    MyApp.sharePopover.open(
                      rect.left,
                      rect.bottom + 6,
                      song.name,
                      singerName,
                    );
                  },
                );
        //!Download demo button
        li.querySelector(".main__content-download").addEventListener(
          "click",
          () => {
            const a = document.createElement("a");
            a.href = song.source;
            a.download = song.name + ".mp3";
            document.body.appendChild(a);
            a.click();
            a.remove();
            new Toast("دانلود دمو شروع شد").success();
          },
        );
      });
    });
  }
}

class Player {
  constructor() {
    this.audio = new Audio();
    this.playerElm = document.getElementById("player");
    this.cover = document.getElementById("playerCover");
    this.title = document.getElementById("playerTitle");
    this.artist = document.getElementById("playerArtist");
    this.playBtn = document.getElementById("playerPlay");
    this.playIcon = document.getElementById("playerPlayIcon");
    this.prevBtn = document.getElementById("playerPrev");
    this.nextBtn = document.getElementById("playerNext");
    this.closeBtn = document.getElementById("playerClose");
    this.seek = document.getElementById("playerSeek");
    this.currentTimeElm = document.getElementById("playerCurrent");
    this.durationElm = document.getElementById("playerDuration");
    this.volumeBtn = document.getElementById("playerVolumeBtn");
    this.volumeIcon = document.getElementById("playerVolumeIcon");
    this.volumeRange = document.getElementById("playerVolume");
    this.shuffleBtn = document.getElementById("playerShuffle");
    this.repeatBtn = document.getElementById("playerRepeat");
    this.queueBtn = document.getElementById("playerQueueBtn");
    this.queuePanel = document.getElementById("playerQueue");
    this.queueList = document.getElementById("queueList");
    this.queueClose = document.getElementById("queueClose");
    this.eqElm = document.getElementById("playerEq");
    this.likeBtn = document.getElementById("playerLikeBtn");
    this.likeIcon = document.getElementById("playerLikeIcon");
    this.currentTrackId = null;
    this.queue = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.shuffle = false;
    this.repeat = false;

    this.audio.volume = 0.8;
    this.audio.preload = "metadata";
    this.bindEvents();
    this.restoreState();
  }

  //!===== Persist player state across refresh =====
  saveState() {
    const state = {
      src: this.audio.src,
      time: this.audio.currentTime,
      title: this.title.textContent,
      artist: this.artist.textContent,
      cover: this.cover.src,
      volume: this.audio.volume,
      shuffled: this.shuffle,
      repeated: this.repeat,
    };
    try {
      localStorage.setItem("ghazalPlayerState", JSON.stringify(state));
    } catch (e) {}
  }

  restoreState() {
    let state = null;
    try {
      state = JSON.parse(localStorage.getItem("ghazalPlayerState"));
    } catch (e) {}
    if (!state || !state.src) return;

    //!Restore volume + shuffle/repeat only (NO autoplay, NO showing player)
    if (state.volume !== undefined) {
      this.audio.volume = state.volume;
      this.volumeRange.value = Math.round(state.volume * 100);
      this.volumeRange.style.setProperty(
        "--fill",
        this.volumeRange.value + "%",
      );
    }
    this.shuffle = !!state.shuffled;
    this.shuffleBtn.classList.toggle("active", this.shuffle);
    this.repeat = !!state.repeated;
    this.repeatBtn.classList.toggle("active", this.repeat);

    //!Keep player hidden — it only appears when user clicks a song
    this.playerElm.classList.add("hidden");
    document.querySelector(".footer").style.display = "none";
  }

  bindEvents() {
    //!Play / Pause
    this.playBtn.addEventListener("click", () => this.togglePlay());

    //!Prev / Next
    this.prevBtn.addEventListener("click", () => this.playPrev());
    this.nextBtn.addEventListener("click", () => this.playNext());

    //!Shuffle / Repeat
    this.shuffleBtn.addEventListener("click", () => {
      this.shuffle = !this.shuffle;
      this.shuffleBtn.classList.toggle("active", this.shuffle);
      new Toast(this.shuffle ? "پخش تصادفی روشن شد" : "پخش تصادفی خاموش شد");
    });
    this.repeatBtn.addEventListener("click", () => {
      this.repeat = !this.repeat;
      this.repeatBtn.classList.toggle("active", this.repeat);
      new Toast(this.repeat ? "تکرار روشن شد" : "تکرار خاموش شد");
    });

    //!Close player
    this.closeBtn.addEventListener("click", () => {
      this.stop();
      this.playerElm.classList.add("hidden");
      document.querySelector(".footer").style.display = "none";
    });

    //!Seek
    this.seek.addEventListener("input", () => {
      //!Fill the bar green as the user drags
      this.seek.style.setProperty("--fill", this.seek.value + "%");
      if (!this.audio.duration) return;
      const pct = parseFloat(this.seek.value) / 100;
      this.audio.currentTime = pct * this.audio.duration;
    });

    //!Volume
    //!Initial fill for volume bar
    this.volumeRange.style.setProperty("--fill", this.volumeRange.value + "%");
    this.volumeRange.addEventListener("input", () => {
      this.audio.volume = parseFloat(this.volumeRange.value) / 100;
      //!Fill volume bar green as it changes
      this.volumeRange.style.setProperty(
        "--fill",
        this.volumeRange.value + "%",
      );
      this.updateVolumeIcon();
    });
    this.volumeBtn.addEventListener("click", () => {
      this.audio.muted = !this.audio.muted;
      this.updateVolumeIcon();
    });

    //!Queue panel
    this.queueBtn.addEventListener("click", () => {
      this.queuePanel.classList.toggle("hidden");
      if (!this.queuePanel.classList.contains("hidden")) {
        this.renderQueue();
      }
    });
    this.queueClose.addEventListener("click", () => {
      this.queuePanel.classList.add("hidden");
    });

    //!Keyboard controls (Space, ←, →, ↑, ↓)
    document.addEventListener("keydown", (e) => {
      //!Ignore when typing in an input
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === "ArrowRight") {
        this.playNext();
      } else if (e.code === "ArrowLeft") {
        this.playPrev();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        this.audio.volume = Math.min(1, this.audio.volume + 0.1);
        this.volumeRange.value = Math.round(this.audio.volume * 100);
        this.volumeRange.style.setProperty(
          "--fill",
          this.volumeRange.value + "%",
        );
        this.updateVolumeIcon();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        this.audio.volume = Math.max(0, this.audio.volume - 0.1);
        this.volumeRange.value = Math.round(this.audio.volume * 100);
        this.volumeRange.style.setProperty(
          "--fill",
          this.volumeRange.value + "%",
        );
        this.updateVolumeIcon();
      }
    });

    //!Like button (heart) — toggle add/remove
        this.likeBtn.addEventListener("click", () => {
          if (this.currentTrackId === null) return;
          const app = MyApp.mySound;
          let foundSong = null;
          app.singerList.singers.forEach((singer) => {
            singer.songs.forEach((song) => {
              if (song.id == this.currentTrackId) foundSong = song;
            });
          });
          if (!foundSong) return;

          const fav = MyApp.getFavorite();
          const already = fav.findFavorite(foundSong.id);
          if (already) {
            //!Remove from favorites
            fav.removeFavorite(foundSong.id);
            this.likeBtn.classList.remove("liked");
            this.likeIcon.className = "fa-regular fa-heart";
          } else {
            //!Add to favorites
            fav.add(foundSong);
            this.likeBtn.classList.add("liked");
            this.likeIcon.className = "fa-solid fa-heart";
          }
        });

    //!Audio events
    this.audio.addEventListener("timeupdate", () => {
      this.updateProgress();
      this.saveState();
    });
    this.audio.addEventListener("loadedmetadata", () => {
      this.durationElm.textContent = this.formatTime(this.audio.duration);
    });
    this.audio.addEventListener("ended", () => this.playNext());
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.setPlayIcon(true);
      this.saveState();
      //!Show equalizer
      if (this.eqElm) this.eqElm.classList.remove("hidden");
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.setPlayIcon(false);
      this.saveState();
      //!Hide equalizer
      if (this.eqElm) this.eqElm.classList.add("hidden");
    });
  }

  //!Set play/pause — toggle .playing class on btn (CSS shows/hides icons)
  setPlayIcon(playing) {
    this.playBtn.classList.toggle("playing", playing);
  }

  //!Play a track (update icons, show player)
    play(source, id, meta = {}) {
      //!Track current id (for like) + count views + save history
      this.currentTrackId = id;
      this.incrementViews(id);
      this.saveToHistory(id, meta);
      //!Sync like state: filled if already in favorites
      const alreadyLiked = MyApp.getFavorite().findFavorite(id);
      this.likeBtn.classList.toggle("liked", !!alreadyLiked);
      this.likeIcon.className = alreadyLiked
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";

    //!Same track → just toggle play/pause (audio events update the icons)
    if (this.audio.src && this.audio.src.endsWith(source)) {
      this.togglePlay();
      return;
    }

    this.audio.src = source;
    this.title.textContent = meta.title || "—";
    this.artist.textContent = meta.artist || "—";
    if (meta.cover) this.cover.src = meta.cover;
    this.playerElm.classList.remove("hidden");
    document.querySelector(".footer").style.display = "block";
    this.audio.play().catch(() => {});
  }

  togglePlay() {
    if (!this.audio.src) return;
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  playNext() {
    if (this.queue.length === 0) return;
    //!Repeat one: replay same track
    if (this.repeat && this.queue[this.currentIndex]) {
      const t = this.queue[this.currentIndex];
      this.audio.currentTime = 0;
      this.audio.play();
      return;
    }
    //!Shuffle: random track
    if (this.shuffle) {
      let next = this.currentIndex;
      while (next === this.currentIndex && this.queue.length > 1) {
        next = Math.floor(Math.random() * this.queue.length);
      }
      this.currentIndex = next;
    } else {
      this.currentIndex =
        this.currentIndex >= this.queue.length - 1 ? 0 : this.currentIndex + 1;
    }
    const track = this.queue[this.currentIndex];
    this.play(track.source, track.id, track.meta);
  }

  playPrev() {
    if (this.queue.length === 0) return;
    if (this.audio.currentTime > 3) {
      //!Restart current track if >3s played
      this.audio.currentTime = 0;
      return;
    }
    if (this.shuffle) {
      let prev = this.currentIndex;
      while (prev === this.currentIndex && this.queue.length > 1) {
        prev = Math.floor(Math.random() * this.queue.length);
      }
      this.currentIndex = prev;
    } else {
      this.currentIndex =
        this.currentIndex <= 0 ? this.queue.length - 1 : this.currentIndex - 1;
    }
    const track = this.queue[this.currentIndex];
    this.play(track.source, track.id, track.meta);
  }

  addToQueue(track) {
    //!Avoid duplicates
    if (!this.queue.some((t) => t.id === track.id)) {
      this.queue.push(track);
    }
    this.currentIndex = this.queue.findIndex((t) => t.id === track.id);
  }

  //!Replace entire queue (used by "play all")
  setQueue(tracks) {
    this.queue = tracks.slice();
    this.currentIndex = 0;
  }

  //!Render the queue panel (shows ALL songs of current singer)
      renderQueue() {
        this.queueList.innerHTML = "";
        //!Get current singer's songs (from singerList)
        const app = MyApp.mySound;
        let tracks = [];
        if (app && app.singerList) {
          let currentSinger = null;
          if (this.currentTrackId !== null) {
            //!Find singer of currently playing track
            app.singerList.singers.forEach((s) => {
              if (!currentSinger) {
                const found = s.songs.find((x) => x.id == this.currentTrackId);
                if (found) currentSinger = s;
              }
            });
          }
          //!If no current track, show ALL songs from ALL singers
          if (!currentSinger) {
            app.singerList.singers.forEach((s) => {
              if (!s.songs) return;
              s.songs.forEach((song) => {
                tracks.push({
                  id: song.id,
                  source: song.source,
                  meta: {
                    title: song.name,
                    artist: s.nameSinger,
                    cover: song.cover,
                  },
                });
              });
            });
          } else {
            //!Singer found → only that singer's songs
            tracks = currentSinger.songs.map((song) => ({
              id: song.id,
              source: song.source,
              meta: {
                title: song.name,
                artist: currentSinger.nameSinger,
                cover: song.cover,
              },
            }));
          }
        }

        if (tracks.length === 0) {
          this.queueList.innerHTML =
            '<li class="player__queue-empty">لیست پخش خالی است</li>';
          return;
        }

        //!Fill internal queue so next/prev work naturally
        this.queue = tracks;
        if (this.currentTrackId !== null) {
          this.currentIndex = this.queue.findIndex(
            (t) => t.id == this.currentTrackId,
          );
        }

        this.queue.forEach((track, index) => {
          const li = document.createElement("li");
          li.className =
            "player__queue-item" + (index === this.currentIndex ? " active" : "");
          li.innerHTML = `
                  <img class="player__queue-cover" src="${track.meta.cover || "public/images/logo.png"}" alt="" />
                  <span class="player__queue-name">${track.meta.title || "—"}</span>
                  <span class="player__queue-artist">${track.meta.artist || ""}</span>`;
          //!Click item → jump to that track
          li.addEventListener("click", () => {
            this.currentIndex = index;
            this.play(track.source, track.id, track.meta);
            this.renderQueue();
          });
          this.queueList.append(li);
        });
      }

  //!Increment view count (for popular filter)
  incrementViews(id) {
    //!Find song in singerList and bump views
    const app = MyApp.mySound;
    if (!app || !app.singerList) return;
    app.singerList.singers.forEach((singer) => {
      singer.songs.forEach((song) => {
        if (song.id == id) {
          song.views = (song.views || 0) + 1;
        }
      });
    });
  }

  //!Play history (last 20 tracks, localStorage)
  saveToHistory(id, meta) {
    try {
      let hist = JSON.parse(localStorage.getItem("ghazalHistory")) || [];
      hist = hist.filter((h) => h.id !== id);
      hist.unshift({ id, meta, ts: Date.now() });
      if (hist.length > 20) hist = hist.slice(0, 20);
      localStorage.setItem("ghazalHistory", JSON.stringify(hist));
    } catch (e) {}
  }

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem("ghazalHistory")) || [];
    } catch (e) {
      return [];
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.setPlayIcon(false);
    //!Reset all song list buttons to play state
    document.querySelectorAll(".main__content-play").forEach((playBtn) => {
      playBtn.classList.remove("playing");
    });
  }

  updateProgress() {
    if (!this.audio.duration) return;
    const pct = (this.audio.currentTime / this.audio.duration) * 100;
    this.seek.value = pct;
    //!Fill the track bar green as it plays
    this.seek.style.setProperty("--fill", pct + "%");
    this.currentTimeElm.textContent = this.formatTime(this.audio.currentTime);
  }

  updateVolumeIcon() {
    const vol = this.audio.muted ? 0 : this.audio.volume;
    const iconName =
      vol === 0
        ? "fa-volume-xmark"
        : vol < 0.5
          ? "fa-volume-low"
          : "fa-volume-high";
    const d =
      vol === 0
        ? "M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l55 55 55-55z"
        : vol < 0.5
          ? "M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C392 276 384 266.9 384 256s8-20 26.2-37.2c-10.3-8.4-11.9-23.5-3.5-33.8S415 2.5 425.3 10.9 437.4 34.4 428 44.8 412.6 181.5 412.6 181.5z"
          : "M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8 25.4-11.8 33.8-3.5zM349.9 162.5c29.5 24.2 48.5 57.3 48.5 93.5s-19 69.3-48.5 93.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8c18.8-15.4 30.7-36.7 30.7-56.2s-11.9-40.8-30.7-56.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM233.5 211.7c11.1 12.3 17.2 27.6 17.2 44.3s-6.1 32-17.2 44.3c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8c4.5-3.7 7.5-9.4 7.5-17s-3-13.3-7.5-17c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z";
    const svg = this.volumeIcon.tagName === "svg" ? this.volumeIcon : null;
    if (svg) {
      svg.classList.remove(
        "fa-volume-xmark",
        "fa-volume-low",
        "fa-volume-high",
      );
      svg.classList.add(iconName);
      svg.setAttribute("data-icon", iconName.replace("fa-", ""));
      const path = svg.querySelector("path");
      if (path) path.setAttribute("d", d);
    } else {
      const newIcon = document.createElement("i");
      newIcon.id = "playerVolumeIcon";
      newIcon.className = "fa-solid " + iconName;
      this.volumeIcon.replaceWith(newIcon);
      this.volumeIcon = newIcon;
    }
  }

  formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
}

class Auth {
  constructor() {
    this.storageKey = "ghazalUsers";
    this.sessionKey = "ghazalSession";
    this.modal = document.getElementById("authModal");
    this.btn = document.getElementById("authBtn");
    this.closeBtn = document.getElementById("authClose");
    this.overlay = document.getElementById("authOverlay");
    this.tabs = document.querySelectorAll(".auth-modal__tab");

    //!Login form
    this.loginForm = document.getElementById("loginForm");
    this.loginUsername = document.getElementById("loginUsername");
    this.loginPassword = document.getElementById("loginPassword");
    this.loginError = document.getElementById("loginError");

    //!Register form
    this.registerForm = document.getElementById("registerForm");
    this.regUsername = document.getElementById("regUsername");
    this.regEmail = document.getElementById("regEmail");
    this.regPassword = document.getElementById("regPassword");
    this.regConfirm = document.getElementById("regConfirm");
    this.registerError = document.getElementById("registerError");

    this.authMenu = document.getElementById("authMenu");
    this.logoutBtn = document.getElementById("logoutBtn");

    this.currentTab = "login";
    this.bindEvents();
    this.updateHeaderUI();
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  }

  setUsers(users) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.sessionKey)) || null;
    } catch {
      return null;
    }
  }

  setSession(user) {
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(this.sessionKey);
  }

  bindEvents() {
    //!Open modal
    this.btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.getSession()) {
        this.authMenu.classList.toggle("hidden");
        return;
      }
      this.open();
    });

    //!Close modal
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });

    //!Tabs
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    //!Submit login
    this.loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    //!Submit register
    this.registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    //!Click outside auth menu closes it
    document.addEventListener("click", (e) => {
      if (!this.btn.contains(e.target) && !this.authMenu.contains(e.target)) {
        this.authMenu.classList.add("hidden");
      }
    });

    //!Logout
    this.logoutBtn.addEventListener("click", () => {
      this.clearSession();
      this.updateHeaderUI();
      this.authMenu.classList.add("hidden");
      new Toast("از حساب خود خارج شدید").danger();
    });
  }

  open() {
    this.modal.classList.remove("hidden");
    this.resetForms();
    this.switchTab("login");
    this.loginUsername.focus();
  }

  close() {
    this.modal.classList.add("hidden");
    this.authMenu.classList.add("hidden");
  }

  resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.loginError.textContent = "";
    this.registerError.textContent = "";
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    this.tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    const isLogin = tabName === "login";
    this.loginForm.classList.toggle("hidden", !isLogin);
    this.registerForm.classList.toggle("hidden", isLogin);
    this.loginError.textContent = "";
    this.registerError.textContent = "";
  }

  //!======== LOGIN ========
  handleLogin() {
    const username = this.loginUsername.value.trim();
    const password = this.loginPassword.value.trim();

    if (!username || !password) {
      this.loginError.textContent = "لطفاً همه فیلدها را پر کنید";
      return;
    }

    const users = this.getUsers();
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === this.hashPassword(password),
    );

    if (!found) {
      //!Lock: unregistered or wrong credentials can NOT log in
      this.loginError.textContent =
        "نام کاربری یا رمز عبور اشتباه است — ابتدا ثبت‌نام کنید";
      return;
    }

    this.setSession({ username: found.username });
    new Toast("خوش آمدید " + found.username).success();
    this.close();
    this.updateHeaderUI();
  }

  //!======== REGISTER ========
  handleRegister() {
    const username = this.regUsername.value.trim();
    const email = this.regEmail.value.trim();
    const password = this.regPassword.value.trim();
    const confirm = this.regConfirm.value.trim();

    if (!username || !email || !password || !confirm) {
      this.registerError.textContent = "لطفاً همه فیلدها را پر کنید";
      return;
    }

    //!Username: letters/digits/underscore, at least 1 letter, min 3
    if (
      !/^[a-zA-Z0-9_]+$/.test(username) ||
      !/[a-zA-Z]/.test(username) ||
      username.length < 3
    ) {
      this.registerError.textContent =
        "نام کاربری: حروف انگلیسی، عدد و _ — حداقل ۳ کاراکتر و شامل حرف";
      return;
    }

    //!Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.registerError.textContent = "ایمیل وارد شده معتبر نیست";
      return;
    }

    //!Password: at least 6 chars
    if (password.length < 6) {
      this.registerError.textContent = "رمز عبور باید حداقل ۶ کاراکتر باشد";
      return;
    }

    //!Confirm password match
    if (password !== confirm) {
      this.registerError.textContent = "تکرار رمز عبور مطابقت ندارد";
      return;
    }

    const users = this.getUsers();
    const exists = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (exists) {
      this.registerError.textContent = "این نام کاربری قبلاً ثبت شده است";
      return;
    }
    //!Email uniqueness check
    const emailExists = users.some(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase(),
    );
    if (emailExists) {
      this.registerError.textContent = "این ایمیل قبلاً ثبت شده است";
      return;
    }

    //!Simple local-only hash (NOT secure — demo)
    const newUser = {
      username,
      email,
      password: this.hashPassword(password),
    };
    users.push(newUser);
    this.setUsers(users);
    //!Auto-login after successful register
    this.setSession({ username });
    new Toast("ثبت‌نام با موفقیت انجام شد").success();
    this.close();
    this.updateHeaderUI();
  }

  //!Simple demo hash — NOT cryptographically secure
  hashPassword(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return "h" + Math.abs(hash).toString(36);
  }

  updateHeaderUI() {
    const session = this.getSession();
    if (session && session.username) {
      this.btn.textContent = session.username;
      this.btn.classList.add("logged-in");
    } else {
      this.btn.textContent = "ورود / ثبت‌نام";
      this.btn.classList.remove("logged-in");
    }
  }
}

class Payment {
  constructor() {
    this.modal = document.getElementById("paymentModal");
    this.btn = document.getElementById("paymentBtn");
    this.closeBtn = document.getElementById("paymentClose");
    this.overlay = document.getElementById("paymentOverlay");
    this.form = document.getElementById("paymentForm");
    this.nameInput = document.getElementById("payName");
    this.cardInput = document.getElementById("payCard");
    this.totalElm = document.getElementById("payTotal");
    this.errorElm = document.getElementById("paymentError");
    this.couponInput = document.getElementById("payCoupon");

    this.bindEvents();
  }

  bindEvents() {
    this.btn.addEventListener("click", () => this.open());
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.processPayment();
    });
  }

  open() {
    const basket = MyApp.getCard();
    const total = this.getTotal(basket);
    if (basket.basketArrays.size === 0) {
      new Toast("سبد خرید خالی است").danger();
      return;
    }
    this.totalElm.textContent = "$" + total;
    this.errorElm.textContent = "";
    this.form.reset();
    this.modal.classList.remove("hidden");
  }

  close() {
    this.modal.classList.add("hidden");
  }

  getTotal(basket) {
    let total = 0;
    basket.basketArrays.forEach((b) => {
      total += b.price * (b.quantity || 1);
    });
    return total;
  }

  processPayment() {
    const name = this.nameInput.value.trim();
    const card = this.cardInput.value.trim().replace(/[-\s]/g, "");
    const coupon = this.couponInput.value.trim().toUpperCase();

    if (!name) {
      this.errorElm.textContent = "نام را وارد کنید";
      return;
    }
    if (!/^\d{16}$/.test(card)) {
      this.errorElm.textContent = "شماره کارت باید ۱۶ رقم باشد";
      return;
    }

    //!Apply coupon discount
    const basket = MyApp.getCard();
    let total = this.getTotal(basket);
    const discountPct = this.getDiscount(coupon);
    if (discountPct > 0) {
      total = Math.round((total * (100 - discountPct)) / 100);
      new Toast(`کد ${coupon} → ${discountPct}% تخفیف اعمال شد`).success();
    }

    //!Trigger download for each purchased song
    const items = Array.from(basket.basketArrays);
    items.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.source;
      a.download = item.name + ".mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    //!Clear basket
    basket.basketArrays.clear();
    basket.showCard();
    basket.calculateTotalPrice();
    basket.setToCookie();

    new Toast("خرید با موفقیت انجام شد — دانلود شروع شد").success();
    this.close();
  }

  //!Discount codes
  getDiscount(code) {
    const codes = { GHAZAL10: 10, GHAZAL20: 20, TAH2002: 15 };
    return codes[code] || 0;
  }
}

class SingerModal {
  constructor() {
    this.modal = document.getElementById("singerModal");
    this.content = document.getElementById("singerModalContent");
    this.closeBtn = document.getElementById("singerClose");
    this.overlay = document.getElementById("singerOverlay");
    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());
  }

  open(singer) {
    if (!singer) return;
    const songsHtml = singer.songs
      .map(
        (song) => `
      <li class="singer-modal__song" data-src="${song.source}" data-id="${song.id}">
        <img class="singer-modal__song-img" src="${song.cover}" alt="" />
        <span class="singer-modal__song-name">${song.name}</span>
        <span class="singer-modal__song-price">$${song.price}</span>
      </li>`,
      )
      .join("");

    this.content.innerHTML = `
      <div class="singer-modal__header">
        <img class="singer-modal__img" src="${singer.profileUrl}" alt="${singer.nameSinger}" />
        <h2 class="singer-modal__name">${singer.nameSinger}</h2>
        <div class="singer-modal__stats">
          <div class="singer-modal__stat">
            <span class="singer-modal__stat-val">${singer.followers}</span>
            <span class="singer-modal__stat-label">دنبال‌کننده</span>
          </div>
          <div class="singer-modal__stat">
            <span class="singer-modal__stat-val">${singer.viewMusic}</span>
            <span class="singer-modal__stat-label">بازدید</span>
          </div>
          <div class="singer-modal__stat">
            <span class="singer-modal__stat-val">${singer.songs.length}</span>
            <span class="singer-modal__stat-label">آهنگ</span>
          </div>
        </div>
      </div>
      <ul class="singer-modal__songs">${songsHtml}</ul>`;

    //!Click on a song → play it
    this.content.querySelectorAll(".singer-modal__song").forEach((el) => {
      el.addEventListener("click", () => {
        const src = el.dataset.src;
        const id = el.dataset.id;
        MyApp.player.addToQueue({
          id,
          source: src,
          meta: {
            title: el.querySelector(".singer-modal__song-name").textContent,
            artist: singer.nameSinger,
            cover: el.querySelector(".singer-modal__song-img").src,
          },
        });
        MyApp.player.play(src, id, {
          title: el.querySelector(".singer-modal__song-name").textContent,
          artist: singer.nameSinger,
          cover: el.querySelector(".singer-modal__song-img").src,
        });
      });
    });

    this.modal.classList.remove("hidden");
  }

  close() {
    this.modal.classList.add("hidden");
  }
}

class HistoryModal {
  constructor() {
    this.modal = document.getElementById("historyModal");
    this.btn = document.getElementById("historyBtn");
    this.content = document.getElementById("historyContent");
    this.closeBtn = document.getElementById("historyClose");
    this.overlay = document.getElementById("historyOverlay");
    this.bindEvents();
  }

  bindEvents() {
    this.btn.addEventListener("click", () => this.open());
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());
  }

  open() {
    const history = MyApp.player.getHistory();
    if (history.length === 0) {
      this.content.innerHTML =
        '<div class="history__empty">هنوز آهنگی پخش نکرده‌اید</div>';
    } else {
      this.content.innerHTML = history
        .map(
          (h) => `
        <div class="history__item" data-id="${h.id}">
          <img class="history__img" src="${h.meta.cover || "public/images/logo.png"}" alt="" />
          <div class="history__info">
            <div class="history__name">${h.meta.title || "—"}</div>
            <div class="history__artist">${h.meta.artist || ""}</div>
          </div>
        </div>`,
        )
        .join("");
      //!Click → play
      this.content.querySelectorAll(".history__item").forEach((el) => {
        el.addEventListener("click", () => {
          const id = el.dataset.id;
          //!Find source from singerList
          const app = MyApp.mySound;
          let found = null;
          app.singerList.singers.forEach((singer) => {
            singer.songs.forEach((song) => {
              if (song.id == id) {
                found = { song, singerName: singer.nameSinger };
              }
            });
          });
          if (found) {
            MyApp.player.addToQueue({
              id,
              source: found.song.source,
              meta: {
                title: found.song.name,
                artist: found.singerName,
                cover: found.song.cover,
              },
            });
            MyApp.player.play(found.song.source, id, {
              title: found.song.name,
              artist: found.singerName,
              cover: found.song.cover,
            });
            this.close();
          }
        });
      });
    }
    this.modal.classList.remove("hidden");
  }

  close() {
    this.modal.classList.add("hidden");
  }
}

class SharePopover {
  constructor() {
    this.popover = document.getElementById("sharePopover");
    this.current = { name: "", artist: "" };
    this.bindEvents();
  }

  //!Open popover near the clicked button
  open(x, y, songName, artistName) {
    this.current.name = songName || "";
    this.current.artist = artistName || "";
    const pop = this.popover;
    //!Position near click, keep inside viewport
    const popW = 170;
    const popH = 200;
    let left = x;
    let top = y;
    if (left + popW > window.innerWidth) left = window.innerWidth - popW - 10;
    if (top + popH > window.innerHeight) top = window.innerHeight - popH - 10;
    if (left < 10) left = 10;
    if (top < 10) top = 10;
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    pop.classList.remove("hidden");
  }

  close() {
    this.popover.classList.add("hidden");
  }

  //!Handle the chosen share option
  share(option) {
    const text = encodeURIComponent(
      `🎵 ${this.current.name} — ${this.current.artist} | غزال`,
    );
    const url = encodeURIComponent(window.location.href);
    if (option === "telegram") {
      window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank", "width=600,height=500");
    } else if (option === "whatsapp") {
      window.open(`https://wa.me/?text=${text}%20${url}`, "_blank", "width=600,height=500");
    } else if (option === "copy") {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          new Toast("لینک کپی شد").success();
        });
      } else {
        new Toast("لینک: " + window.location.href).success();
      }
    }
    this.close();
  }

  bindEvents() {
    //!Click on a share option
    this.popover.querySelectorAll(".share-popover__item").forEach((item) => {
      item.addEventListener("click", () => {
        this.share(item.dataset.share);
      });
    });
    //!Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.popover.classList.contains("hidden") && !e.target.closest("#sharePopover") && !e.target.closest(".main__content-share")) {
        this.close();
      }
    });
    //!Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }
}

class MyApp {
  static init() {
      this.mySound = new Sound();
      this.player = new Player();
      this.auth = new Auth();
      this.payment = new Payment();
      this.singerModal = new SingerModal();
      this.historyModal = new HistoryModal();
      this.sharePopover = new SharePopover();
      this.initBackToTop();
      this.initTheme();
      this.initFooterActions();
    }

    //!Footer quick-access links
    static initFooterActions() {
      document.querySelectorAll(".footer-action").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const action = link.dataset.action;
          if (action === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (action === "singers") {
            const section = document.getElementById("singersSection");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          } else if (action === "popular") {
                      //!Switch to popular filter
                      const filterBtn = document.querySelector('#mainFilters .main__filter[data-filter="popular"]');
                      if (filterBtn) filterBtn.click();
                      //!Scroll to song list
                      const list = document.getElementById("MusicList");
                      if (list) list.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else if (action === "all") {
                      //!Switch to all filter
                      const filterBtn = document.querySelector('#mainFilters .main__filter[data-filter="all"]');
                      if (filterBtn) filterBtn.click();
                      const list = document.getElementById("MusicList");
                      if (list) list.scrollIntoView({ behavior: "smooth", block: "start" });
                    } else if (action === "cart") {
            //!Open basket dropdown
            const basketElm = document.querySelector(".header__links-shop");
            const basketBox = document.querySelector(".header__card");
            if (basketElm && basketBox) {
              const isHidden = basketBox.classList.contains("hidden");
              if (isHidden) {
                basketBox.classList.remove("hidden");
              }
            }
          } else if (action === "auth") {
            //!Open auth modal
            if (MyApp.auth) MyApp.auth.open();
          }
        });
      });
    }

  static initTheme() {
    const btn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");
    if (!btn || !icon) return;
    //!Restore saved theme
    const saved = localStorage.getItem("ghazalTheme");
    if (saved === "light") {
      document.body.classList.add("light");
      icon.className = "fa-solid fa-moon";
    }
    btn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light");
      localStorage.setItem("ghazalTheme", isLight ? "light" : "dark");
      icon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    });
  }

  static initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  static getCard() {
    return this.mySound.basket;
  }
  static getFavorite() {
    return this.mySound.favorite;
  }
}

MyApp.init();
