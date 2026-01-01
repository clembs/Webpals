import {
	EMAIL_SMTP_HOST,
	EMAIL_SMTP_PASSWORD,
	EMAIL_SMTP_PORT,
	EMAIL_SMTP_USERNAME
} from '$env/static/private';

import nodemailer from 'nodemailer';

export const emailTransporter = nodemailer.createTransport({
	host: EMAIL_SMTP_HOST,
	port: Number(EMAIL_SMTP_PORT),
	secure: true,
	auth: {
		user: EMAIL_SMTP_USERNAME,
		pass: EMAIL_SMTP_PASSWORD
	}
});
