var utils = {};
utils.navigation = {
  init: function() {
		utils.navigation.create();
		utils.navigation.pageEvent();
		utils.navigation.clickTab();
		utils.navigation.hover();
	},
	create: function() {
		var main = data.main;
		var tab = "";
		$.each(main, function(k, v) {
			var list = v.list;
			tab += '<li><a>' + v.title + '</a></li>';
			var section = '<section class="nav-list">';
			section += '<h4 class="nav-list-title">' + v.title + '</h4>';
			$.each(list, function(key, classify) {
				var item = classify.item;
				section += '<div class="nav-list-main">';
				section += '<div class="nav-classify">';
				section += '<div class="nav-classify-tab">' + classify.tab + '</div>';
				section += '<div class="nav-classify-content"><div class="nav-classify-bg"><div class="line"></div></div>';
				$.each(item, function(ik, iv) {
					section += '<div class="nav-classify-item" data-intro="' + iv.title + '"><a target="_blank" href="' + iv.href + '">' + iv.name + '</a></div>';
				});
				section += '</div>';
				section += '</div></div>';
			});
			section += '</section>';
			$(".nav-content").append(section);
		});
		$(".nav-aside ul").append(tab);
	},
	pageEvent: function() {
		$(document).on("mouseover", ".nav-classify-content", function(e) {
			$(this).addClass("active");
			e.stopPropagation();
		}).on("mouseout", ".nav-classify-content", function(e) {
			$(this).removeClass("active");
			e.stopPropagation();
		});
		$(window).on("scroll", function() {
			var wTop = $(this).scrollTop();
			var nTop = 110;
			if (wTop >= nTop) {
				$(".nav-aside").css({
					"top": "0px"
				});
			} else {
				$(".nav-aside").css({
					"top": nTop + "px"
				});
			};
		});
	},
	clickTab: function() {
		var tab = $(".nav-aside>ul>li");
		var section = $(".nav-list");
		var wHeight = window.innerHeight;
		$(document).on("click", ".nav-aside>ul>li", function() {
			var index = $(this).index();
			var sTop = section.eq(index).offset().top;
			$("body,html").animate({
				scrollTop: sTop + "px"
			}, 1000);
		});
	},
	hover: function() {
		$(document).on("mouseover", ".nav-classify-item", function(e) {
			var intro = $(this).attr("data-intro");
			var top = $(this).offset().top - $(this).height() - 10;
			var left = $(this).offset().left + $(this).innerWidth() / 2;
			if (intro != "") {
				var grumble = '<div class="grumble" style="top:' + top + 'px;left:' + left + 'px;">' + intro + '</div>';
				$("body").append(grumble);
			};
			e.stopPropagation();
		}).on("mouseout", ".nav-classify-item", function(e) {
			$(".grumble").remove();
			e.stopPropagation();
		});
	}
};
$(function() {
	utils.navigation.init();
});
