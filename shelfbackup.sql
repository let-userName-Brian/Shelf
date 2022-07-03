--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Ubuntu 14.4-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.2

-- Started on 2022-07-02 11:29:44 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 2978288)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4318 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 2978299)
-- Name: inventory; Type: TABLE; Schema: public; Owner: qjqnfbpcscmlcx
--

CREATE TABLE public.inventory (
    item_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    item_name character varying(255) NOT NULL,
    brand character varying(255) NOT NULL,
    nsn character varying(255) NOT NULL,
    item_size character varying(255) NOT NULL,
    gender character varying(255) NOT NULL,
    building character varying(255) NOT NULL,
    aisle character varying(255) NOT NULL,
    item_count integer NOT NULL,
    minimum_count integer NOT NULL,
    count_status character varying(255) NOT NULL,
    ordered integer NOT NULL,
    intial_gear boolean NOT NULL,
    returnable_item boolean NOT NULL,
    initial character varying,
    returnable character varying,
    courier character varying NOT NULL,
    tracking character varying NOT NULL,
    contact character varying(500)
);


ALTER TABLE public.inventory OWNER TO qjqnfbpcscmlcx;

--
-- TOC entry 211 (class 1259 OID 3008721)
-- Name: users; Type: TABLE; Schema: public; Owner: qjqnfbpcscmlcx
--

CREATE TABLE public.users (
    dod_id character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    user_password character varying(255),
    is_admin boolean,
    shopping_cart jsonb,
    issued_items jsonb
);


ALTER TABLE public.users OWNER TO qjqnfbpcscmlcx;

--
-- TOC entry 4309 (class 0 OID 2978299)
-- Dependencies: 210
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: qjqnfbpcscmlcx
--

COPY public.inventory (item_id, item_name, brand, nsn, item_size, gender, building, aisle, item_count, minimum_count, count_status, ordered, intial_gear, returnable_item, initial, returnable, courier, tracking, contact) FROM stdin;
93f4632f-3477-486f-8bdb-b025edd000e3	Waffle Top *	Gortex	253647182	Large		994	2	50	25	undefined	0	f	t	\N	\N	-	-	\N
d897bef2-971d-4c1b-9d95-80ea4592bdb0	Fleece Top *	Gortex	748394756	Small		994	2	99	25	undefined	0	f	t	\N	\N	-	-	\N
ba95721c-21a5-4216-a671-d2fefd883c25	Fleece Top *	Gortex	839476527	Large		994	2	71	25	undefined	0	f	t	\N	\N	-	-	\N
cad1ec85-cfee-449f-b8a5-4396d41f9f85	Fleece Top *	Gortex	647583746	X-Large		994	2	50	25	undefined	0	f	t	\N	\N	-	-	\N
2904bd9e-3151-4369-b7fb-0eb3dc471a18	Gloves *	Tacti-Cool	27839476	Large	N/A	994	4	31	25	undefined	0	f	f	\N	\N	-	-	\N
b4d60a3e-2f5e-4653-aae4-ddf3816806f9	Waffle Top *	Gortex	364758374	X-Large		994	2	50	25	undefined	0	f	t	\N	\N	-	-	\N
813a6772-e676-4b29-aaec-13199eb53bd5	Gloves *	Tacti-Cool	26718263	Medium	N/A	994	4	32	25	undefined	0	f	f	\N	\N	-	-	undefined
79e11120-b288-4230-a01a-1b387fe6c716	Gloves *	Tacti-Cool	273847568	Small	N/A	994	4	38	25	undefined	0	f	f	\N	\N	-	-	\N
31626d4b-4f8b-4c68-a708-02e6c1bc09f1	Grenade Pouch *	Tacti-Cool	36748593	-		994	4	6	25	undefined	0	f	t	\N	\N	-	-	\N
a2c6cb82-9555-4b72-ab1f-6c1538b54750	Hand Cuff Pouch *	Tact-Cool	746352739	-		994	4	71	25	undefined	0	f	t	\N	\N	-	-	\N
bae689c0-9496-4601-b3a2-c3553fa3105d	Fleece Top *	Gortex	938476378	Medium		994	2	32	25	undefined	0	f	t	\N	\N	undefined	undefined	undefined
3169a76e-1e54-4a81-b75b-a17ab57d7a92	Handcuff Key *	Smith & Wesson	3748594758	-		994	1	100	50	undefined	0	f	f	\N	\N	-	-	\N
7fd78c7e-3ef4-4227-b544-c318c9fd4fe1	Handcuffs *	Smith & Wesson	758394758	-		994	1	101	50	undefined	0	f	t	\N	\N	-	-	\N
58a99cf1-4487-4338-af52-8672cbb4095a	Helmet *	Cool-Guy	769467543	Large	N/A	994	3	34	90	undefined	4	f	t	\N	\N	-	-	\N
00e4abb7-fd1c-44c5-8d69-0b77f6a42fce	Helmet *	Tacti-Cool	124354895	Medium		994	3	11	25	undefined	0	f	t	\N	\N	-	-	\N
4ef91b1e-7389-49c2-bccf-412ee5d8b0a3	Helmet *	Tacti-Cool	748394657	Small		994	3	37	25	undefined	0	f	t	\N	\N	-	-	\N
5f8fb3b4-bb15-4ee4-b9b4-be1ae44ee06d	M4 Pouch *	Tacti-Cool	758574627	X-Large		994	4	32	25	undefined	0	f	t	\N	\N	-	-	\N
282f7a40-c0f7-4e4a-b0cb-b59df8ae776e	M9 Pouch *	Tacti-Cool	75857436178	X-Large		994	4	47	25	undefined	0	f	t	\N	\N	-	-	\N
2348b1d0-4a0b-41fb-9baf-00348bd714aa	Radio Pouch *	Tacti-Cool	123456789	-	N/A	994	4	50	25	undefined	4	f	f	\N	\N	-	-	\N
0e166d0c-5816-4d20-bee8-2931247ccea4	Waffle Top *	Gortex	263748615	Medium		994	2	50	25	undefined	0	f	t	\N	\N	-	-	\N
72d4d99d-1ff9-4302-8daa-aee7146ff56c	SF Patch *		738465748	-		994	1	50	24	undefined	0	t	t	\N	\N	-	-	\N
a38acdd8-2e35-47fa-9fd4-180abf90c2bb	Waffle Top *	Gortex	647384657	Small		994	2	50	25	undefined	0	f	t	\N	\N	-	-	\N
e7dd9fe6-8f6a-44b5-8de1-fe3ee369d440	Sand Tees	Cool	9878			994		0	0	undefined	100	f	t	\N	\N	undefined	undefined	undefined
848b8afa-d2e6-48af-995d-659f7cdd1869	Flashlight Pouch *	Tacti-Cool	857384957	-		994	4	30	25	undefined	0	t	f	\N	\N	undefined	undefined	undefined
05f0a397-dea9-4e1c-8b07-14acc8bf9320	Boots *	Nike	184596738	9	Male	994	10	50	5	undefined	0	f	t	\N	\N	undefined	undefined	undefined
4cde26b6-7ebd-4480-a760-db0697197040	Boots *	Nike	736489163	8	Male	994	10	100	5	undefined	1	f	f	\N	\N	undefined	undefined	undefined
\.


--
-- TOC entry 4310 (class 0 OID 3008721)
-- Dependencies: 211
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: qjqnfbpcscmlcx
--

COPY public.users (dod_id, first_name, last_name, email, user_password, is_admin, shopping_cart, issued_items) FROM stdin;
465768394	Brian	Hardy	brian.hardy@gmail.com	password	t	\N	\N
123456789	Yurik	Garcia	yurik.garcia@gmail.com	password	t	[{"Name": "Boots *", "UUID": "05f0a397-dea9-4e1c-8b07-14acc8bf9320", "Brand": "Nike"}, {"Name": "Fleece Top *", "UUID": "ba95721c-21a5-4216-a671-d2fefd883c25", "Brand": "Gortex"}, {"Name": "Fleece Top *", "UUID": "ba95721c-21a5-4216-a671-d2fefd883c25", "Brand": "Gortex"}]	[{"Name": "Boots *", "UUID": "05f0a397-dea9-4e1c-8b07-14acc8bf9320", "Brand": "Nike"}, {"Name": "Fleece Top *", "UUID": "cad1ec85-cfee-449f-b8a5-4396d41f9f85", "Brand": "Gortex"}, {"Name": "SF Patch *", "UUID": "72d4d99d-1ff9-4302-8daa-aee7146ff56c", "Brand": ""}, {"Name": "Gloves *", "UUID": "2904bd9e-3151-4369-b7fb-0eb3dc471a18", "Brand": "Tacti-Cool"}, {"Name": "Handcuff Key *", "UUID": "3169a76e-1e54-4a81-b75b-a17ab57d7a92", "Brand": "Smith & Wesson"}, {"Name": "Boots *", "UUID": "05f0a397-dea9-4e1c-8b07-14acc8bf9320", "Brand": "Nike"}, {"Name": "Fleece Top *", "UUID": "cad1ec85-cfee-449f-b8a5-4396d41f9f85", "Brand": "Gortex"}]
746923645	Dwight	Veon	dwight.veon@gmail.com	password	t	\N	\N
\.


--
-- TOC entry 4167 (class 2606 OID 2978306)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: qjqnfbpcscmlcx
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (item_id);


--
-- TOC entry 4169 (class 2606 OID 3008727)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: qjqnfbpcscmlcx
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (dod_id);


--
-- TOC entry 4316 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: qjqnfbpcscmlcx
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO qjqnfbpcscmlcx;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 4317 (class 0 OID 0)
-- Dependencies: 840
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO qjqnfbpcscmlcx;


-- Completed on 2022-07-02 11:29:48 EDT

--
-- PostgreSQL database dump complete
--

