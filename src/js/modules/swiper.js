import Swiper from "swiper/bundle";
import {Scrollbar} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/scrollbar'


const swiperFeedback = new Swiper('.carousel', {
	modules: [Scrollbar],
	scrollbar: {
		el: '.carousel__scrollbar',
		draggable: true,
		dragClass: 'carousel__drag',
		horizontalClass: 'carousel__scrollbar',
	},
	initialSlide: 0,
	spaceBetween: 32,
});

export default swiperFeedback;

