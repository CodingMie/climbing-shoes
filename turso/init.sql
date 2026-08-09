-- Climbing Shoe Platform · Turso 初始化脚本
-- 结构由 drizzle 迁移生成（与 drizzle/0000..0005 一致），数据由 scripts/seed.ts 导出
-- 用法：turso db shell <db-name> < turso/init.sql
PRAGMA foreign_keys = ON;

CREATE TABLE account (
	id text PRIMARY KEY NOT NULL,
	account_id text NOT NULL,
	provider_id text NOT NULL,
	user_id text NOT NULL,
	access_token text,
	refresh_token text,
	id_token text,
	access_token_expires_at integer,
	refresh_token_expires_at integer,
	scope text,
	password text,
	created_at integer NOT NULL,
	updated_at integer NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE session (
	id text PRIMARY KEY NOT NULL,
	expires_at integer NOT NULL,
	token text NOT NULL,
	created_at integer NOT NULL,
	updated_at integer NOT NULL,
	ip_address text,
	user_agent text,
	user_id text NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX session_token_unique ON session (token);

CREATE TABLE user (
	id text PRIMARY KEY NOT NULL,
	name text NOT NULL,
	email text NOT NULL,
	email_verified integer DEFAULT false NOT NULL,
	image text,
	created_at integer NOT NULL,
	updated_at integer NOT NULL,
	username text,
	display_username text,
	role text DEFAULT 'user' NOT NULL
);
CREATE UNIQUE INDEX user_email_unique ON user (email);
CREATE UNIQUE INDEX user_username_unique ON user (username);

CREATE TABLE verification (
	id text PRIMARY KEY NOT NULL,
	identifier text NOT NULL,
	value text NOT NULL,
	expires_at integer NOT NULL,
	created_at integer,
	updated_at integer
);

CREATE TABLE brand (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	name text NOT NULL,
	logo text,
	description text
);
CREATE UNIQUE INDEX brand_name_unique ON brand (name);

CREATE TABLE shoe (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	brand_id integer NOT NULL,
	model text NOT NULL,
	price integer NOT NULL,
	scenarios text NOT NULL,
	stiffness text NOT NULL,
	width text NOT NULL,
	level text NOT NULL,
	downturn text NOT NULL,
	closure text NOT NULL,
	material text,
	images text NOT NULL,
	status text DEFAULT 'pending' NOT NULL,
	submitted_by text,
	reviewed_by text,
	reject_reason text,
	created_at integer DEFAULT (unixepoch()) NOT NULL,
	updated_at integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (brand_id) REFERENCES brand(id) ON UPDATE no action ON DELETE no action
);

CREATE TABLE foot_profile (
	user_id text PRIMARY KEY NOT NULL,
	foot_length integer NOT NULL,
	foot_width text NOT NULL,
	foot_shape text NOT NULL,
	arch text NOT NULL,
	instep text NOT NULL,
	heel text NOT NULL,
	bunion text NOT NULL,
	street_size real NOT NULL,
	created_at integer DEFAULT (unixepoch()) NOT NULL,
	updated_at integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE review (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	user_id text NOT NULL,
	shoe_id integer NOT NULL,
	size_tried real NOT NULL,
	size_system text NOT NULL,
	size_delta real NOT NULL,
	wrap integer NOT NULL,
	comfort integer NOT NULL,
	precision integer NOT NULL,
	sensitivity integer NOT NULL,
	friction integer NOT NULL,
	support integer NOT NULL,
	overall integer NOT NULL,
	heel_fit text NOT NULL,
	toe_fit text NOT NULL,
	instep_fit text NOT NULL,
	forefoot_fit text NOT NULL,
	arch_fit text NOT NULL,
	breathability text NOT NULL,
	scenarios_used text NOT NULL,
	duration text NOT NULL,
	content text NOT NULL,
	pros text,
	cons text,
	created_at integer DEFAULT (unixepoch()) NOT NULL,
	updated_at integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (shoe_id) REFERENCES shoe(id) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX review_user_shoe_size_unique ON review (user_id, shoe_id, size_delta);

-- 初始数据：品牌
INSERT INTO brand (id, name, logo, description) VALUES (1, 'La Sportiva', NULL, '意大利顶级品牌，竞技与高性能攀岩鞋的代名词。');
INSERT INTO brand (id, name, logo, description) VALUES (2, 'Scarpa', NULL, '意大利老牌，性能与舒适兼备，产品线覆盖全场景。');
INSERT INTO brand (id, name, logo, description) VALUES (3, 'Tenaya', NULL, '西班牙品牌，以舒适包裹与精准脚感著称。');
INSERT INTO brand (id, name, logo, description) VALUES (4, 'Evolv', NULL, '美国品牌，抱石与馆内场景的热门选择。');
INSERT INTO brand (id, name, logo, description) VALUES (5, 'Unparallel', NULL, '韩国品牌，橡胶性能出色，性价比高。');
INSERT INTO brand (id, name, logo, description) VALUES (6, 'Boreal', NULL, '西班牙品牌，攀岩橡胶技术的先行者。');
INSERT INTO brand (id, name, logo, description) VALUES (7, 'Mad Rock', NULL, '美国品牌，高性价比，新手友好。');
INSERT INTO brand (id, name, logo, description) VALUES (8, 'Butora', NULL, '韩国品牌，以合脚舒适与扎实做工闻名。');
INSERT INTO brand (id, name, logo, description) VALUES (9, 'Five Ten', NULL, '美国品牌（现属 adidas），传奇 Stealth 橡胶的发明者，抱石鞋经典。');
INSERT INTO brand (id, name, logo, description) VALUES (10, 'Ocún', NULL, '捷克品牌，传承 Rock Pillars 制鞋工艺，性能与舒适兼备。');
INSERT INTO brand (id, name, logo, description) VALUES (11, 'Red Chili', NULL, '德国品牌，由自由攀岩先驱 Stefan Glowacz 创立，高性能产品线丰富。');
INSERT INTO brand (id, name, logo, description) VALUES (12, 'So Ill', NULL, '加拿大品牌，设计语言大胆，抱石场景的新锐力量。');
INSERT INTO brand (id, name, logo, description) VALUES (13, 'AKU', NULL, '意大利品牌，蒙特贝卢纳手工制造，高端攀岩鞋黑马。');
INSERT INTO brand (id, name, logo, description) VALUES (14, 'ARTDENNX', NULL, '国产攀岩鞋品牌，主打高性价比入门与进阶鞋款，岩时攀岩独家发售。');
INSERT INTO brand (id, name, logo, description) VALUES (15, 'Hylonomus', NULL, '国产专业攀岩鞋品牌「始林蜥」，以最早爬行动物 Hylonomus 命名，新锐力量。');

-- 初始数据：鞋款（113 款，全部 approved）
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('1', '1', 'Solution', '1380', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-solution.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('2', '1', 'Miura 系带版', '1180', '["难度","馆内全能"]', '硬', '窄', '极致性能', '适度', '系带', '皮革', '["/shoe-images/la-sportiva-miura-系带版.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('3', '1', 'Katana', '1080', '["馆内全能","难度"]', '中', '中', '进阶', '适度', '魔术贴', '皮革', '["/shoe-images/la-sportiva-katana.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('4', '1', 'Tarantulace', '680', '["馆内全能"]', '软', '宽', '入门', '自然', '系带', '皮革', '["/shoe-images/la-sportiva-tarantulace.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('5', '1', 'Finale', '850', '["馆内全能"]', '软', '宽', '入门', '自然', '套脚', '皮革', '["/shoe-images/la-sportiva-finale.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('6', '1', 'Mythos', '980', '["传统多段","馆内全能"]', '软', '宽', '进阶', '自然', '系带', '皮革', '["/shoe-images/la-sportiva-mythos.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('7', '1', 'Skwama', '1280', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-skwama.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('8', '1', 'Futura', '1350', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-futura.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('9', '1', 'Genius', '1220', '["抱石","难度"]', '软', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-genius.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('10', '1', 'TC Pro', '1320', '["传统多段","难度"]', '中', '中', '极致性能', '自然', '系带', '皮革', '["/shoe-images/la-sportiva-tc-pro.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('11', '1', 'Otaki', '1150', '["难度","馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-otaki.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('12', '1', 'Cobra 4:9', '1250', '["抱石"]', '软', '窄', '极致性能', '激进', '套脚', '合成纤维', '["/shoe-images/la-sportiva-cobra-4-9.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('13', '2', 'Instinct VS', '1280', '["抱石","馆内全能"]', '中', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/scarpa-instinct-vs.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('14', '2', 'Booster', '1250', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/scarpa-booster.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('15', '2', 'Drago', '1320', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/scarpa-drago.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('16', '2', 'Drago LV', '1320', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/scarpa-drago-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('17', '2', 'Origin', '780', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/scarpa-origin.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('18', '2', 'Helix', '950', '["馆内全能","难度"]', '中', '中', '进阶', '适度', '系带', '皮革', '["/shoe-images/scarpa-helix.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('19', '3', 'Masai', '1150', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/tenaya-masai.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('20', '3', 'Mundaka', '1180', '["抱石","竞技"]', '软', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/tenaya-mundaka.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('21', '3', 'Tanta', '880', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/tenaya-tanta.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('22', '3', 'Oasi', '1150', '["抱石","馆内全能"]', '软', '中', '进阶', '适度', '魔术贴', '超细纤维', '["/shoe-images/tenaya-oasi.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('23', '3', 'Tarifa', '1120', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/tenaya-tarifa.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('24', '3', 'Ra', '950', '["馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/tenaya-ra.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('25', '3', 'Inti', '820', '["馆内全能"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/tenaya-inti.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('26', '4', 'Phantom', '1350', '["抱石"]', '硬', '中', '极致性能', '激进', '系带', '合成纤维', '["/shoe-images/evolv-phantom.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('27', '4', 'Phantom LV', '1350', '["抱石"]', '硬', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-phantom-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('28', '4', 'Phantom Pro', '1350', '["竞技","抱石"]', '硬', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-phantom-pro.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('29', '4', 'Phantom Pro LV', '1350', '["竞技","抱石"]', '硬', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-phantom-pro-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('30', '4', 'Shaman', '1200', '["馆内全能","抱石"]', '中', '中', '极致性能', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('31', '4', 'Shaman LV', '1200', '["馆内全能","抱石"]', '中', '窄', '极致性能', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('32', '4', 'Shaman Lace', '790', '["难度","抱石"]', '硬', '窄', '极致性能', '激进', '系带', '合成纤维', '["/shoe-images/evolv-shaman-lace.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('33', '4', 'Shaman Lace LV', '790', '["难度","抱石"]', '硬', '窄', '极致性能', '激进', '系带', '合成纤维', '["/shoe-images/evolv-shaman-lace-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('34', '4', 'Shaman Pro', '1350', '["竞技","抱石"]', '硬', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-pro.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('35', '4', 'Shaman Pro LV', '1350', '["竞技","抱石"]', '硬', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-pro-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('36', '4', 'Shaman Trance', '1350', '["抱石","馆内全能"]', '中', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-trance.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('37', '4', 'Shaman Trance LV', '1350', '["抱石","馆内全能"]', '中', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-trance-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('38', '4', 'Shaman 2S', '1200', '["馆内全能","抱石"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-2s.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('39', '4', 'Shaman 2S LV', '1200', '["馆内全能","抱石"]', '中', '窄', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-shaman-2s-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('40', '4', 'Geshido', '1200', '["馆内全能","难度"]', '硬', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-geshido.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('41', '4', 'Geshido LV', '1200', '["馆内全能","难度"]', '硬', '窄', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-geshido-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('42', '4', 'Geshido Lace', '720', '["馆内全能","难度"]', '硬', '中', '进阶', '适度', '系带', '皮革', '["/shoe-images/evolv-geshido-lace.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('43', '4', 'V6', '1160', '["馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-v6.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('44', '4', 'V6 LV', '1160', '["馆内全能"]', '中', '窄', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-v6-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('45', '4', 'Zenist', '1200', '["抱石","馆内全能"]', '软', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-zenist.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('46', '4', 'Zenist LV', '1200', '["抱石","馆内全能"]', '软', '窄', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-zenist-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('47', '4', 'Zenist Pro', '1350', '["竞技","抱石"]', '中', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-zenist-pro.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('48', '4', 'Zenist Pro LV', '1350', '["竞技","抱石"]', '中', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/evolv-zenist-pro-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('49', '4', 'Defy', '830', '["馆内全能"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/evolv-defy.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('50', '4', 'Defy LV', '830', '["馆内全能"]', '软', '窄', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/evolv-defy-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('51', '4', 'Defy Lace', '900', '["馆内全能"]', '软', '中', '入门', '自然', '系带', '合成纤维', '["/shoe-images/evolv-defy-lace.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('52', '4', 'Defy Lace LV', '900', '["馆内全能"]', '软', '窄', '入门', '自然', '系带', '合成纤维', '["/shoe-images/evolv-defy-lace-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('53', '4', 'Yosemite Bum', '1390', '["传统多段","难度"]', '中', '中', '进阶', '自然', '系带', '合成纤维', '["/shoe-images/evolv-yosemite-bum.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('54', '4', 'Yosemite Bum LV', '1390', '["传统多段","难度"]', '中', '窄', '进阶', '自然', '系带', '合成纤维', '["/shoe-images/evolv-yosemite-bum-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('55', '4', 'Rave', '900', '["馆内全能"]', '软', '宽', '入门', '自然', '套脚', '皮革', '["/shoe-images/evolv-rave.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('56', '4', 'Kira', '980', '["馆内全能","抱石"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-kira.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('57', '4', 'Kronos', '980', '["馆内全能","抱石"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/evolv-kronos.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('58', '4', 'Elektra', '450', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/evolv-elektra.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('59', '4', 'Elektra Lace', '500', '["馆内全能"]', '软', '中', '入门', '自然', '系带', '皮革', '["/shoe-images/evolv-elektra-lace.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('60', '4', 'Venga Youth', '450', '["馆内全能"]', '软', '中', '入门', '自然', '套脚', '合成纤维', '["/shoe-images/evolv-venga-youth.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('61', '6', 'Ninja', '1050', '["竞技","难度"]', '硬', '窄', '极致性能', '适度', '系带', '皮革', '["/seed/boreal-ninja.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('62', '6', 'Mutant', '1020', '["抱石"]', '软', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/seed/boreal-mutant.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('63', '6', 'Alpha', '900', '["难度","馆内全能"]', '中', '中', '进阶', '适度', '系带', '合成纤维', '["/seed/boreal-alpha.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('64', '6', 'Joker', '760', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '皮革', '["/seed/boreal-joker.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('65', '7', 'Drifter', '550', '["馆内全能"]', '软', '宽', '入门', '自然', '系带', '皮革', '["/shoe-images/mad-rock-drifter.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('66', '7', 'Drone CS', '920', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/mad-rock-drone-cs.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('67', '7', 'Haywire', '800', '["抱石","馆内全能"]', '软', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/mad-rock-haywire.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('68', '7', 'Remora', '700', '["馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/mad-rock-remora.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('69', '9', 'Hiangle', '1280', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/five-ten-hiangle.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('70', '10', 'Ozone Plus', '1080', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/ocun-ozone-plus.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('71', '10', 'Jett QC', '720', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/ocun-jett-qc.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('72', '10', 'Rebel', '880', '["传统多段","馆内全能"]', '中', '中', '进阶', '自然', '系带', '皮革', '["/shoe-images/ocun-rebel.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('73', '11', 'Circuit', '820', '["馆内全能"]', '中', '中', '入门', '自然', '魔术贴', '合成纤维', '["/seed/red-chili-circuit.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('74', '11', 'Fusion', '980', '["抱石","馆内全能"]', '软', '中', '进阶', '适度', '魔术贴', '超细纤维', '["/seed/red-chili-fusion.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('75', '11', 'Ventic', '1150', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/seed/red-chili-ventic.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('76', '12', 'Makoto', '1200', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/so-ill-makoto.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('77', '12', 'Street Sender', '1050', '["抱石"]', '软', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/so-ill-street-sender.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('78', '13', 'Rock Pilot', '1180', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/seed/aku-rock-pilot.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('79', '13', 'Zenit', '950', '["馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/seed/aku-zenit.svg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('80', '1', 'Solution Comp', '1150', '["抱石","难度"]', '中', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-solution-comp.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('81', '1', 'Adam Ondra Comp', '1300', '["抱石","竞技"]', '软', '窄', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-adam-ondra-comp.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('82', '1', 'Skwama Lite', '850', '["馆内全能","抱石"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-skwama-lite.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('83', '1', 'Tarantula', '560', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '皮革', '["/shoe-images/la-sportiva-tarantula.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('84', '1', 'Kubo', '850', '["馆内全能"]', '中', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-kubo.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('85', '1', 'Theory', '1150', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-theory.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('86', '1', 'Mandala', '1200', '["抱石"]', '软', '中', '极致性能', '激进', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-mandala.png"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('87', '1', 'Mantra', '950', '["馆内全能","抱石"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/la-sportiva-mantra.png"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('88', '1', 'Cobra', '800', '["竞技","抱石"]', '软', '窄', '极致性能', '适度', '套脚', '皮革', '["/shoe-images/la-sportiva-cobra.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('89', '2', 'Drago XT', '1200', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/scarpa-drago-xt.png"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('90', '2', 'Instinct VSR', '1150', '["抱石","馆内全能"]', '中', '中', '极致性能', '适度', '魔术贴', '合成纤维', '["/shoe-images/scarpa-instinct-vsr.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('91', '2', 'Instinct VSR-LV', '1200', '["抱石","馆内全能"]', '中', '窄', '极致性能', '适度', '魔术贴', '合成纤维', '["/shoe-images/scarpa-instinct-vsr-lv.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('92', '2', 'Furia S', '780', '["抱石"]', '软', '窄', '极致性能', '激进', '套脚', '合成纤维', '["/shoe-images/scarpa-furia-s.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('93', '2', 'Furia Air', '980', '["抱石"]', '软', '窄', '极致性能', '激进', '套脚', '合成纤维', '["/shoe-images/scarpa-furia-air.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('94', '2', 'Reflex VS', '530', '["馆内全能"]', '软', '宽', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/scarpa-reflex-vs.jpeg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('95', '2', 'Quantix SF', '666', '["抱石","馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '皮革', '["/shoe-images/scarpa-quantix-sf.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('96', '14', 'Cx rave', '278', '["馆内全能"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/artdennx-cx-rave.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('97', '14', 'Cx rave-x', '268', '["馆内全能"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/artdennx-cx-rave-x.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('98', '14', 'Cx Red point', '299', '["馆内全能","抱石"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/cx-red-point.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('99', '15', 'V3 悟 GAIN', '706', '["馆内全能","抱石"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/hylonomus-悟.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('100', '15', 'V8 砺 WHETSTONE', '890', '["难度","馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '合成纤维', '["/shoe-images/hylonomus-砺.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('101', '8', 'Spider', '899', '["抱石"]', '中', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/butora-spider.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('102', '8', 'Ibex', '1199', '["抱石","难度"]', '软', '中', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/butora-ibex.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('103', '8', 'New Acro', '999', '["抱石"]', '软', '窄', '极致性能', '激进', '魔术贴', '超细纤维', '["/shoe-images/butora-new-acro.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('104', '8', 'Acro Comp', '999', '["抱石","竞技"]', '软', '窄', '极致性能', '激进', '系带', '超细纤维', '["/shoe-images/butora-acro-comp.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('105', '8', 'Gomi', '899', '["抱石","馆内全能"]', '中', '中', '进阶', '适度', '魔术贴', '超细纤维', '["/shoe-images/butora-gomi.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('106', '8', 'Komet', '599', '["馆内全能"]', '中', '中', '进阶', '自然', '魔术贴', '合成纤维', '["/shoe-images/butora-komet.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('107', '8', 'Komet Lace', '599', '["馆内全能"]', '中', '中', '进阶', '自然', '系带', '合成纤维', '["/shoe-images/butora-komet-lace.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('108', '8', 'Nix', '759', '["竞技","馆内全能"]', '中', '中', '进阶', '自然', '套脚', '合成纤维', '["/shoe-images/butora-nix.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('109', '8', 'Altura', '935', '["传统多段","馆内全能"]', '中', '中', '进阶', '自然', '系带', '皮革', '["/shoe-images/butora-altura.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('110', '8', 'Mantra', '835', '["馆内全能","传统多段"]', '中', '中', '进阶', '自然', '系带', '合成纤维', '["/shoe-images/butora-mantra.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('111', '8', 'Libra', '659', '["馆内全能"]', '软', '中', '入门', '自然', '系带', '合成纤维', '["/shoe-images/butora-libra.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('112', '8', 'Senegi', '369', '["馆内全能"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/butora-senegi.jpg"]', 'approved');
INSERT INTO shoe (id, brand_id, model, price, scenarios, stiffness, width, level, downturn, closure, material, images, status) VALUES ('113', '8', 'New Comet', '540', '["馆内全能"]', '软', '中', '入门', '自然', '魔术贴', '合成纤维', '["/shoe-images/butora-new-comet.jpg"]', 'approved');
