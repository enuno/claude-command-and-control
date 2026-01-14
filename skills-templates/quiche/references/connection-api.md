# quiche Connection API Reference

Complete reference for the `quiche::Connection` struct - the core type for managing QUIC connections.

## Connection Creation

### `quiche::connect()`
Creates a new QUIC connection as a client.

```rust
pub fn connect(
    server_name: Option<&str>,
    scid: &ConnectionId,
    local: SocketAddr,
    peer: SocketAddr,
    config: &mut Config,
) -> Result<Connection>
```

**Parameters:**
- `server_name`: SNI for TLS (None to disable)
- `scid`: Source connection ID
- `local`: Local socket address
- `peer`: Peer socket address
- `config`: Connection configuration

### `quiche::accept()`
Creates a new QUIC connection as a server.

```rust
pub fn accept(
    scid: &ConnectionId,
    odcid: Option<&ConnectionId>,
    local: SocketAddr,
    peer: SocketAddr,
    config: &mut Config,
) -> Result<Connection>
```

**Parameters:**
- `scid`: Source connection ID
- `odcid`: Original destination CID (from Retry)
- `local`: Local socket address
- `peer`: Peer socket address
- `config`: Connection configuration

### `quiche::negotiate_version()`
Generates a Version Negotiation packet.

```rust
pub fn negotiate_version(
    scid: &ConnectionId,
    dcid: &ConnectionId,
    out: &mut [u8],
) -> Result<usize>
```

### `quiche::retry()`
Generates a Retry packet for address validation.

```rust
pub fn retry(
    scid: &ConnectionId,
    dcid: &ConnectionId,
    new_scid: &ConnectionId,
    token: &[u8],
    version: u32,
    out: &mut [u8],
) -> Result<usize>
```

## Packet Processing

### `recv()`
Processes QUIC packets received from the peer.

```rust
pub fn recv(&mut self, buf: &mut [u8], info: RecvInfo) -> Result<usize>
```

**Returns:** Number of bytes processed

**Example:**
```rust
let recv_info = RecvInfo { from: peer_addr, to: local_addr };
match conn.recv(&mut buf[..len], recv_info) {
    Ok(processed) => println!("Processed {} bytes", processed),
    Err(Error::Done) => (),
    Err(e) => return Err(e),
}
```

### `send()`
Writes a single QUIC packet to be sent.

```rust
pub fn send(&mut self, out: &mut [u8]) -> Result<(usize, SendInfo)>
```

**Returns:** `(bytes_written, send_info)` or `Error::Done` when complete

**Example:**
```rust
loop {
    match conn.send(&mut out) {
        Ok((len, info)) => {
            socket.send_to(&out[..len], info.to)?;
        }
        Err(Error::Done) => break,
        Err(e) => return Err(e),
    }
}
```

### `send_on_path()`
Sends packets on a specific network path.

```rust
pub fn send_on_path(
    &mut self,
    out: &mut [u8],
    from: Option<SocketAddr>,
    to: Option<SocketAddr>,
) -> Result<(usize, SendInfo)>
```

## Stream Operations

### `stream_send()`
Writes data to a stream.

```rust
pub fn stream_send(
    &mut self,
    stream_id: u64,
    buf: &[u8],
    fin: bool,
) -> Result<usize>
```

**Parameters:**
- `stream_id`: Stream identifier
- `buf`: Data to send
- `fin`: True if this is the final data

**Returns:** Bytes written (may be less than buf.len() due to flow control)

### `stream_recv()`
Reads contiguous data from a stream.

```rust
pub fn stream_recv(
    &mut self,
    stream_id: u64,
    out: &mut [u8],
) -> Result<(usize, bool)>
```

**Returns:** `(bytes_read, is_fin)`

### `stream_send_zc()`
Zero-copy stream send using buffer factory.

```rust
pub fn stream_send_zc<B: BufSplit>(
    &mut self,
    stream_id: u64,
    buf: B,
    fin: bool,
) -> Result<usize>
```

### `stream_priority()`
Sets stream priority.

```rust
pub fn stream_priority(
    &mut self,
    stream_id: u64,
    urgency: u8,
    incremental: bool,
) -> Result<()>
```

**Parameters:**
- `urgency`: 0-255 (default 127, lower = higher priority)
- `incremental`: True for incremental delivery

### `stream_shutdown()`
Closes stream reading or writing.

```rust
pub fn stream_shutdown(
    &mut self,
    stream_id: u64,
    direction: Shutdown,
    err: u64,
) -> Result<()>
```

**Direction:** `Shutdown::Read` or `Shutdown::Write`

### `stream_capacity()`
Returns available send capacity for a stream.

```rust
pub fn stream_capacity(&self, stream_id: u64) -> Result<usize>
```

### `stream_finished()`
Checks if stream has been completed.

```rust
pub fn stream_finished(&self, stream_id: u64) -> bool
```

## Stream Iteration

### `readable()`
Returns iterator over streams with readable data.

```rust
pub fn readable(&self) -> StreamIter
```

### `writable()`
Returns iterator over streams that can be written to.

```rust
pub fn writable(&self) -> StreamIter
```

### `stream_readable_next()` / `stream_writable_next()`
Returns next readable/writable stream ID (one-shot, faster than iterator).

```rust
pub fn stream_readable_next(&mut self) -> Option<u64>
pub fn stream_writable_next(&mut self) -> Option<u64>
```

## Connection State

### `is_established()`
Returns true if handshake is complete.

```rust
pub fn is_established(&self) -> bool
```

### `is_in_early_data()`
Returns true if 0-RTT is available.

```rust
pub fn is_in_early_data(&self) -> bool
```

### `is_closed()`
Returns true when connection is fully closed.

```rust
pub fn is_closed(&self) -> bool
```

### `is_draining()`
Returns true if connection is draining (no new data allowed).

```rust
pub fn is_draining(&self) -> bool
```

### `is_readable()`
Returns true if any stream has data to read.

```rust
pub fn is_readable(&self) -> bool
```

## Timeout Management

### `timeout()`
Returns time until next timeout event.

```rust
pub fn timeout(&self) -> Option<Duration>
```

### `timeout_instant()`
Returns absolute instant of next timeout.

```rust
pub fn timeout_instant(&self) -> Option<Instant>
```

### `on_timeout()`
Processes timeout events.

```rust
pub fn on_timeout(&mut self)
```

**Example:**
```rust
loop {
    if let Some(timeout) = conn.timeout() {
        tokio::time::sleep(timeout).await;
    }
    conn.on_timeout();
}
```

## Connection Management

### `close()`
Closes the connection with error code and reason.

```rust
pub fn close(&mut self, app: bool, err: u64, reason: &[u8]) -> Result<()>
```

**Parameters:**
- `app`: True for application error, false for transport error
- `err`: Error code
- `reason`: Human-readable reason

### `peer_error()` / `local_error()`
Returns connection error information.

```rust
pub fn peer_error(&self) -> Option<&ConnectionError>
pub fn local_error(&self) -> Option<&ConnectionError>
```

### `application_proto()`
Returns negotiated ALPN protocol.

```rust
pub fn application_proto(&self) -> &[u8]
```

### `server_name()`
Returns SNI from client hello.

```rust
pub fn server_name(&self) -> Option<&str>
```

## DATAGRAM Support

### `dgram_send()` / `dgram_send_vec()`
Sends unreliable datagram.

```rust
pub fn dgram_send(&mut self, buf: &[u8]) -> Result<()>
pub fn dgram_send_vec(&mut self, buf: Vec<u8>) -> Result<()>
```

### `dgram_recv()` / `dgram_recv_vec()`
Receives datagram.

```rust
pub fn dgram_recv(&mut self, buf: &mut [u8]) -> Result<usize>
pub fn dgram_recv_vec(&mut self) -> Result<Vec<u8>>
```

### `dgram_max_writable_len()`
Returns maximum datagram payload size.

```rust
pub fn dgram_max_writable_len(&self) -> Option<usize>
```

### `dgram_recv_queue_len()` / `dgram_send_queue_len()`
Returns queue lengths.

```rust
pub fn dgram_recv_queue_len(&self) -> usize
pub fn dgram_send_queue_len(&self) -> usize
```

## Connection IDs

### `source_id()` / `source_ids()`
Returns source connection ID(s).

```rust
pub fn source_id(&self) -> ConnectionId
pub fn source_ids(&self) -> impl Iterator<Item = &ConnectionId>
```

### `destination_id()`
Returns current destination connection ID.

```rust
pub fn destination_id(&self) -> ConnectionId
```

### `new_scid()`
Advertises additional source connection ID.

```rust
pub fn new_scid(
    &mut self,
    scid: &ConnectionId,
    reset_token: u128,
    retire_if_needed: bool,
) -> Result<u64>
```

### `retire_dcid()`
Requests retirement of destination connection IDs.

```rust
pub fn retire_dcid(&mut self, seq: u64) -> Result<()>
```

## Path Management

### `migrate()`
Migrates connection to new addresses (client only).

```rust
pub fn migrate(&mut self, local: SocketAddr, peer: SocketAddr) -> Result<u64>
```

### `migrate_source()`
Changes only local address.

```rust
pub fn migrate_source(&mut self, local: SocketAddr) -> Result<u64>
```

### `probe_path()`
Validates a proposed path.

```rust
pub fn probe_path(&mut self, local: SocketAddr, peer: SocketAddr) -> Result<u64>
```

### `path_event_next()`
Returns next path event.

```rust
pub fn path_event_next(&mut self) -> Option<PathEvent>
```

### `path_stats()`
Returns statistics for a specific path.

```rust
pub fn path_stats(&self, local: SocketAddr, peer: SocketAddr) -> Result<PathStats>
```

### `paths_iter()`
Iterates destination addresses for a source.

```rust
pub fn paths_iter(&self, from: SocketAddr) -> impl Iterator<Item = SocketAddr>
```

## Statistics

### `stats()`
Returns connection statistics.

```rust
pub fn stats(&self) -> Stats
```

**Stats fields:**
- `recv`: Bytes received
- `sent`: Bytes sent
- `lost`: Lost packets
- `retrans`: Retransmitted packets
- `rtt`: Round-trip time
- `cwnd`: Congestion window
- `delivery_rate`: Estimated delivery rate
- `paths_count`: Number of active paths

### `peer_transport_params()`
Returns peer's transport parameters.

```rust
pub fn peer_transport_params(&self) -> Option<&TransportParams>
```

## Debugging

### `trace_id()`
Returns unique connection identifier for logging.

```rust
pub fn trace_id(&self) -> &str
```

### `set_qlog()`
Enables qlog diagnostic logging.

```rust
pub fn set_qlog(
    &mut self,
    writer: Box<dyn Write + Send + Sync>,
    title: String,
    description: String,
)
```

### `set_qlog_with_level()`
Enables qlog with specific verbosity.

```rust
pub fn set_qlog_with_level(
    &mut self,
    writer: Box<dyn Write + Send + Sync>,
    title: String,
    description: String,
    level: QlogLevel,
)
```

### `set_keylog()`
Enables TLS key logging.

```rust
pub fn set_keylog(&mut self, writer: Box<dyn Write + Send + Sync>)
```

## TLS/Crypto

### `peer_cert()` / `peer_cert_chain()`
Returns peer certificate(s).

```rust
pub fn peer_cert(&self) -> Option<&[u8]>
pub fn peer_cert_chain(&self) -> Option<Vec<&[u8]>>
```

### `set_session()`
Resumes cached TLS session.

```rust
pub fn set_session(&mut self, session: &[u8]) -> Result<()>
```

### `session()`
Returns session for caching.

```rust
pub fn session(&self) -> Option<Vec<u8>>
```

## Send Configuration

### `max_send_udp_payload_size()`
Returns maximum UDP payload size.

```rust
pub fn max_send_udp_payload_size(&self) -> usize
```

### `send_quantum()` / `send_quantum_on_path()`
Returns burst size from congestion control.

```rust
pub fn send_quantum(&self) -> usize
pub fn send_quantum_on_path(&self, local: SocketAddr, peer: SocketAddr) -> Result<usize>
```

### `pacing_enabled()`
Returns whether pacing is enabled.

```rust
pub fn pacing_enabled(&self) -> bool
```

## Stream Limits

### `peer_streams_left_bidi()` / `peer_streams_left_uni()`
Returns remaining stream capacity.

```rust
pub fn peer_streams_left_bidi(&self) -> u64
pub fn peer_streams_left_uni(&self) -> u64
```
