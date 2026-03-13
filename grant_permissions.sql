-- Grant permissions on payment tables to eximpo_user
GRANT ALL PRIVILEGES ON TABLE payments TO eximpo_user;
GRANT ALL PRIVILEGES ON TABLE payment_transactions TO eximpo_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO eximpo_user;
