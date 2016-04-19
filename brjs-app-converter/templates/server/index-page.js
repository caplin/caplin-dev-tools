/* eslint-disable react/no-danger */

import React, {PropTypes} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export default function createIndexPage(indexPageProps) {
	const indexPageHTML = renderToStaticMarkup(<IndexPage {...indexPageProps} />);

	return `<!DOCTYPE html>${indexPageHTML}`;
}

function IndexPage({title = 'FX Mobile', variant = 'caplin', locale = 'en', version = ''}) {
	const bundleName = `public/bundle${version && `-${version}`}.js`;
	const head = Head(title, variant);
	const htmlAttributes = version ? {manifest: 'manifest.appcache'} : null;
	const i18NSetup = createI18NSetup(locale);
	const initializingAnimation = InitializingAnimation();

	return (
		<html {...htmlAttributes}>
			{head}
			<body className="caplin visual">
				{initializingAnimation}

				<div id="please-rotate">
					<div className="logo"></div>
					<div className="rotate"></div>
					<div className="message">{'Please switch orientation'}</div>
				</div>
				<div id="background"></div>

				<script dangerouslySetInnerHTML={{__html: i18NSetup}}>
				</script>

				<script src={bundleName}></script>
			</body>
		</html>
	);
}

IndexPage.propTypes = {
	locale: PropTypes.string,
	title: PropTypes.string,
	variant: PropTypes.string,
	version: PropTypes.string
};

function Head(title, variant) {
	const androidIcons = [
		['ldpi', '36x36'],
		['mdpi', '48x48'],
		['hdpi', '72x72'],
		['xhdpi', '96x96'],
		['xxhdpi', '144x144'],
		['xxxhdpi', '192x192']
	].map(([dpi, sizes]) => AndroidIconLink(variant, dpi, sizes));
	const iOSIcons = [
		'76', '120', '152', '180'
	].map((size) => IOSIconLink(variant, size));

	return (
		<head>
			<title>{title}</title>

			<link
				href="public/initializing.css"
				rel="stylesheet"
			/>

			<meta
				content="yes"
				name="mobile-web-app-capable"
			/>
			<meta
				content="telephone=no"
				name="format-detection"
			/>
			<meta
				content="yes"
				name="apple-mobile-web-app-capable"
			/>
			<meta
				content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
				name="viewport"
			/>

			{androidIcons}
			{iOSIcons}
		</head>
	);
}

function AndroidIconLink(variant, dpi, sizes) {
	return (
		<link
			href={`public/icons/${variant}/android/drawable-${dpi}/ic_launcher.png`}
			rel="icon"
			sizes={sizes}
		/>
	);
}

function IOSIconLink(variant, size) {
	return (
		<link
			href={`public/icons/${variant}/ios/icon${size}.png" sizes="${size}x${size}`}
			rel="apple-touch-icon"
		/>
	);
}

function InitializingAnimation() {
	const svgStyleObj = {
		enableBackground: 'new 0 0 50 50'
	};

	return (
		<div id="initialising">
			<div>
				<svg
					height="30px"
					id="loader"
					style={svgStyleObj}
					version="1.1"
					viewBox="0 0 24 30"
					width="24px"
					x="0px"
					y="0px"
				>
					<rect
						fill="#333"
						height="20"
						width="4"
						x="0"
						y="0"
					>
						<animate
							attributeName="opacity"
							attributeType="XML"
							begin="0s"
							dur="1s"
							repeatCount="indefinite"
							values="1; .2; 1"
						/>
					</rect>
					<rect
						fill="#333"
						height="20"
						width="4"
						x="7"
						y="0"
					>
						<animate
							attributeName="opacity"
							attributeType="XML"
							begin="0.2s"
							dur="1s"
							repeatCount="indefinite"
							values="1; .2; 1"
						/>
					</rect>
					<rect
						fill="#333"
						height="20"
						width="4"
						x="14"
						y="0"
					>
						<animate
							attributeName="opacity"
							attributeType="XML"
							begin="0.4s"
							dur="1s"
							repeatCount="indefinite"
							values="1; .2; 1"
						/>
					</rect>
				</svg>
				<p id="status">{'loading'}</p>
				<p>
					<span id="loading-percent">
						&nbsp;
					</span>
				</p>
			</div>
			<div
				id="retry"
				style={{display: 'none'}}
			>
				<button></button>
			</div>
		</div>
	);
}

function createI18NSetup(locale) {
	return `
		window.$_brjsI18nProperties = {
			${locale}: {}
		};
		window.$_brjsI18nUseLocale = '${locale}';`;
}
