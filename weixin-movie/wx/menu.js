'use strict'

module.exports = {
	'button' : [{
		'name': '点击事件',
		'type': 'click',
		'key': 'menu_click'
	}, {
		'name': '点出菜单',
		'sub_button': [{
			'name': '跳转URL',
			'type': 'view',
			'url': 'http://github.com'
		}, {
			'name': '扫码推送事件',
			'type': 'scancode_push',
			'key': 'qr_scan'
		}, {
			'name': '扫码推送中',
			'type': 'scancode_waitmsg',
			'key': 'qr_scan_wait'
		}, {
			'name': '系统拍照',
			'type': 'pic_sysphoto',
			'key': 'pic_photo'
		}, {
			'name': '弹出系统拍照或相册',
			'type': 'pic_photo_or_album',
			'key': 'pic_photo_album'
		}]
	}, {
		'name': '点出菜单2',
		'sub_button': [{
			'name': '微信相册发图',
			'type': 'pic_weixin',
			'key': 'pic_weixin'
		}, {
			'name': '地理位置选择',
			'type': 'location_select',
			'key': 'location_select'
		}, {
			'name': '扫码推送中',
			'type': 'scancode_waitmsg',
			'key': 'qr_scan_wait'
		}
		// , {
		// 	'name': '下发图片消息',
		// 	'type': 'media_id',
		// 	'media_id': 'xxx'
		// }, {
		// 	'name': '跳转图文消息url',
		// 	'type': 'view_limited',
		// 	'media_id': 'xxx'
		// }
		]		
	}]
}