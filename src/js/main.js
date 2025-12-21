"use strict";

import "/src/js/modules/dashboardMeter.js";
import swiperFeedback from "./modules/swiper.js";
import Header from "./modules/header.js";

window.addEventListener("DOMContentLoaded", async () => {
  new Header();
  swiperFeedback.init();
});
