# :panda_face: :department_store: canvas-data-warehouse

Middleware for cloning Canvas Data resources to a PostgreSQL database.

---

## Configuration

### Prerequisites

`canvas-data-warehouse` requires Docker version `>= 1.9` as it uses Docker's networking feature: [https://blog.docker.com/2015/11/docker-multi-host-networking-ga/](https://blog.docker.com/2015/11/docker-multi-host-networking-ga/)

`canvas-data-warehouse` uses the `rollbar-relay` to log it's events to [Rollbar](https://rollbar.com/). This module requires the `ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN` environment variable to be set. This token is listed in your [Rollbar](https://rollbar.com/) project's settings under *Project Access Tokens*.

### Environment Variables

Environment Variable | Description
---------------------|------------
`CD_API_URL`         | Canvas Data API URL (*not* your institution's Canvas URL)
`CD_API_KEY`         | Canvas Data API Key
`CD_API_SECRET`      | Canvas Data API Secret
`CD_PG_HOST`         | PostgreSQL Database Host
`CD_PG_PORT`         | PostgreSQL Database Port
`CD_PG_USER`         | PostgreSQL Database Username
`CD_PG_PASSWORD`     | PostgreSQL Database Password

---

### One-line Installation

```shell
git clone https://github.com/neurotech/canvas-data-warehouse && \
  cd canvas-data-warehouse && \
  ./bootstrap.sh
```

### Manual Installation

#### Clone

Clone this repository to your host.

```shell
git clone https://github.com/neurotech/canvas-data-warehouse
```

#### Bootstrap

Change into the `canvas-data-warehouse` directory and execute the `bootstrap.sh` script.

```shell
cd canvas-data-warehouse
./bootstrap.sh
```
