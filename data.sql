CREATE TABLE public.groups (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    name text NOT NULL,
    date timestamp with time zone DEFAULT now(),
    code text NOT NULL
);

CREATE TABLE public.members (
    id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE TABLE public.positions (
    id integer NOT NULL,
    route_id integer,
    lat numeric NOT NULL,
    lng numeric NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);

CREATE TABLE public.routes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    groups boolean DEFAULT false,
    group_id integer
);

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    token_value integer DEFAULT 0 NOT NULL
);
