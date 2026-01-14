# quiche HTTP/3 API Reference

Complete reference for the `quiche::h3` module - HTTP/3 wire protocol and QPACK implementation.

## Module Constants

```rust
// ALPN protocols for HTTP/3
pub const APPLICATION_PROTOCOL: &[&[u8]] = &[b"h3", b"h3-29", b"h3-28", b"h3-27"];
```

## h3::Config

### Creation

```rust
pub fn new() -> Result<Config>
```

**Example:**
```rust
let h3_config = quiche::h3::Config::new()?;
```

### Configuration Methods

```rust
// Set maximum header list size
pub fn set_max_field_section_size(&mut self, v: u64)

// Set QPACK maximum table capacity
pub fn set_qpack_max_table_capacity(&mut self, v: u64)

// Set QPACK blocked streams
pub fn set_qpack_blocked_streams(&mut self, v: u64)

// Enable extended CONNECT (WebTransport)
pub fn enable_extended_connect(&mut self, enabled: bool)

// Enable additional settings
pub fn set_additional_settings(&mut self, settings: Vec<(u64, u64)>)
```

## h3::Connection

### Creation

```rust
pub fn with_transport(
    conn: &mut quiche::Connection,
    config: &Config,
) -> Result<Connection>
```

**Example:**
```rust
// After QUIC handshake is complete
let h3_config = quiche::h3::Config::new()?;
let mut h3_conn = quiche::h3::Connection::with_transport(&mut conn, &h3_config)?;
```

### Sending Requests (Client)

```rust
// Send HTTP request headers
pub fn send_request<T: IntoIterator<Item = Header>>(
    &mut self,
    conn: &mut quiche::Connection,
    headers: T,
    fin: bool,
) -> Result<u64>
```

**Parameters:**
- `conn`: QUIC connection
- `headers`: Request headers (must include pseudo-headers)
- `fin`: True if no body follows

**Returns:** Stream ID

**Example:**
```rust
let headers = vec![
    quiche::h3::Header::new(b":method", b"GET"),
    quiche::h3::Header::new(b":scheme", b"https"),
    quiche::h3::Header::new(b":authority", b"example.com"),
    quiche::h3::Header::new(b":path", b"/api/data"),
    quiche::h3::Header::new(b"accept", b"application/json"),
];

let stream_id = h3_conn.send_request(&mut conn, &headers, true)?;
```

### Sending Responses (Server)

```rust
// Send HTTP response headers
pub fn send_response<T: IntoIterator<Item = Header>>(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    headers: T,
    fin: bool,
) -> Result<()>

// Send response with priority
pub fn send_response_with_priority<T: IntoIterator<Item = Header>>(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    headers: T,
    priority: &Priority,
    fin: bool,
) -> Result<()>
```

**Example:**
```rust
let headers = vec![
    quiche::h3::Header::new(b":status", b"200"),
    quiche::h3::Header::new(b"content-type", b"application/json"),
    quiche::h3::Header::new(b"content-length", b"42"),
];

h3_conn.send_response(&mut conn, stream_id, &headers, false)?;
```

### Sending Body Data

```rust
// Send body data
pub fn send_body(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    body: &[u8],
    fin: bool,
) -> Result<usize>

// Zero-copy body send
pub fn send_body_zc<B: BufSplit>(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    body: B,
    fin: bool,
) -> Result<usize>
```

**Returns:** Bytes written

**Example:**
```rust
let body = b"{\"status\": \"ok\"}";
let written = h3_conn.send_body(&mut conn, stream_id, body, true)?;
```

### Receiving Body Data

```rust
pub fn recv_body(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    out: &mut [u8],
) -> Result<usize>
```

**Example:**
```rust
let mut buf = [0; 4096];
loop {
    match h3_conn.recv_body(&mut conn, stream_id, &mut buf) {
        Ok(read) => {
            println!("Received {} bytes", read);
            // Process buf[..read]
        }
        Err(quiche::h3::Error::Done) => break,
        Err(e) => return Err(e),
    }
}
```

### Additional Headers (Trailers, 1xx)

```rust
// Send additional headers
pub fn send_additional_headers<T: IntoIterator<Item = Header>>(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    headers: T,
    fin: bool,
) -> Result<()>

// With priority
pub fn send_additional_headers_with_priority<T: IntoIterator<Item = Header>>(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    headers: T,
    priority: &Priority,
    fin: bool,
) -> Result<()>
```

**Example (Trailers):**
```rust
let trailers = vec![
    quiche::h3::Header::new(b"x-checksum", b"abc123"),
];
h3_conn.send_additional_headers(&mut conn, stream_id, &trailers, true)?;
```

### Polling for Events

```rust
pub fn poll(&mut self, conn: &mut quiche::Connection) -> Result<(u64, Event)>
```

**Returns:** `(stream_id, event)` or `Error::Done`

**Example:**
```rust
loop {
    match h3_conn.poll(&mut conn) {
        Ok((stream_id, quiche::h3::Event::Headers { list, has_body })) => {
            println!("Stream {}: Headers received", stream_id);
            for header in list {
                println!("  {}: {}",
                    String::from_utf8_lossy(header.name()),
                    String::from_utf8_lossy(header.value()));
            }
            if has_body {
                println!("  (has body)");
            }
        }

        Ok((stream_id, quiche::h3::Event::Data)) => {
            println!("Stream {}: Data available", stream_id);
            // Call recv_body() to read
        }

        Ok((stream_id, quiche::h3::Event::Finished)) => {
            println!("Stream {}: Complete", stream_id);
        }

        Ok((stream_id, quiche::h3::Event::Reset(error_code))) => {
            println!("Stream {}: Reset with error {}", stream_id, error_code);
        }

        Ok((stream_id, quiche::h3::Event::PriorityUpdate)) => {
            println!("Stream {}: Priority updated", stream_id);
        }

        Ok((_, quiche::h3::Event::GoAway)) => {
            println!("GoAway received");
        }

        Err(quiche::h3::Error::Done) => break,

        Err(e) => {
            println!("HTTP/3 error: {:?}", e);
            break;
        }
    }
}
```

### Priority Management

```rust
// Update request priority
pub fn send_priority_update_for_request(
    &mut self,
    conn: &mut quiche::Connection,
    stream_id: u64,
    priority: &Priority,
) -> Result<()>

// Get last priority update
pub fn take_last_priority_update(
    &mut self,
    prioritized_element_type: u8,
) -> Option<(u64, Priority)>
```

### Graceful Shutdown

```rust
pub fn send_goaway(
    &mut self,
    conn: &mut quiche::Connection,
    id: u64,
) -> Result<()>
```

### Feature Detection

```rust
// Check if peer supports DATAGRAM
pub fn dgram_enabled_by_peer(&self) -> bool

// Check if peer supports extended CONNECT
pub fn extended_connect_enabled_by_peer(&self) -> bool
```

### Statistics

```rust
pub fn stats(&self) -> Stats
```

### Peer Settings

```rust
pub fn peer_settings_raw(&self) -> Option<&[(u64, u64)]>
```

## h3::Header

### Creation

```rust
pub fn new(name: &[u8], value: &[u8]) -> Header
```

### Access

```rust
pub fn name(&self) -> &[u8]
pub fn value(&self) -> &[u8]
```

**Example:**
```rust
let header = quiche::h3::Header::new(b":status", b"200");
println!("Name: {:?}", header.name());   // b":status"
println!("Value: {:?}", header.value()); // b"200"
```

## h3::HeaderRef

Zero-copy header reference.

```rust
pub fn new(name: &'a [u8], value: &'a [u8]) -> HeaderRef<'a>
pub fn name(&self) -> &[u8]
pub fn value(&self) -> &[u8]
```

## h3::Priority

Extensible priority parameters (RFC 9218).

```rust
pub fn new(urgency: u8, incremental: bool) -> Priority
pub fn urgency(&self) -> u8
pub fn incremental(&self) -> bool
```

**Urgency levels:** 0 (highest) to 7 (lowest), default is 3

## h3::Event

Events returned by `poll()`:

```rust
pub enum Event {
    // Headers received
    Headers {
        list: Vec<Header>,
        has_body: bool,
    },

    // Body data available (call recv_body)
    Data,

    // Stream finished
    Finished,

    // Stream reset by peer
    Reset(u64),

    // Priority update received
    PriorityUpdate,

    // Graceful shutdown initiated
    GoAway,
}
```

## h3::Error

```rust
pub enum Error {
    // No more work to do
    Done,

    // Buffer too short
    BufferTooShort,

    // Internal error
    InternalError,

    // Excessive load
    ExcessiveLoad,

    // Stream creation blocked
    StreamCreationError,

    // Stream blocked by flow control
    StreamBlocked,

    // Closed critical stream
    ClosedCriticalStream,

    // Frame unexpected
    FrameUnexpected,

    // Frame error
    FrameError,

    // QPACK decompression failed
    QpackDecompressionFailed,

    // Transport error
    TransportError(quiche::Error),

    // Missing settings
    MissingSettings,

    // Request rejected
    RequestRejected,

    // Request cancelled
    RequestCancelled,

    // Request incomplete
    RequestIncomplete,

    // Message error
    MessageError,

    // Connect error
    ConnectError,

    // Version fallback
    VersionFallback,
}
```

## Complete Example: HTTP/3 Client

```rust
use quiche::h3;
use std::net::UdpSocket;

fn http3_get(url: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let socket = UdpSocket::bind("0.0.0.0:0")?;
    socket.connect("example.com:443")?;

    // QUIC config
    let mut config = quiche::Config::new(quiche::PROTOCOL_VERSION)?;
    config.set_application_protos(h3::APPLICATION_PROTOCOL)?;
    config.set_initial_max_data(10_000_000);
    config.set_initial_max_stream_data_bidi_local(1_000_000);
    config.set_initial_max_stream_data_bidi_remote(1_000_000);
    config.set_initial_max_streams_bidi(100);

    // Create QUIC connection
    let scid = quiche::ConnectionId::from_ref(&[0; 16]);
    let local = socket.local_addr()?;
    let peer = socket.peer_addr()?;
    let mut conn = quiche::connect(Some("example.com"), &scid, local, peer, &mut config)?;

    // Handshake
    let mut buf = [0; 65535];
    let mut out = [0; 1350];

    loop {
        // Send pending packets
        while let Ok((len, info)) = conn.send(&mut out) {
            socket.send(&out[..len])?;
        }

        if conn.is_established() {
            break;
        }

        // Receive and process
        let len = socket.recv(&mut buf)?;
        let info = quiche::RecvInfo { from: peer, to: local };
        conn.recv(&mut buf[..len], info)?;
    }

    // Create HTTP/3 connection
    let h3_config = h3::Config::new()?;
    let mut h3_conn = h3::Connection::with_transport(&mut conn, &h3_config)?;

    // Send request
    let req = vec![
        h3::Header::new(b":method", b"GET"),
        h3::Header::new(b":scheme", b"https"),
        h3::Header::new(b":authority", b"example.com"),
        h3::Header::new(b":path", b"/"),
    ];
    let stream_id = h3_conn.send_request(&mut conn, &req, true)?;

    // Process response
    let mut body = Vec::new();
    loop {
        // Send packets
        while let Ok((len, _)) = conn.send(&mut out) {
            socket.send(&out[..len])?;
        }

        // Receive
        if let Ok(len) = socket.recv(&mut buf) {
            let info = quiche::RecvInfo { from: peer, to: local };
            conn.recv(&mut buf[..len], info)?;
        }

        // Poll HTTP/3 events
        loop {
            match h3_conn.poll(&mut conn) {
                Ok((sid, h3::Event::Headers { list, .. })) if sid == stream_id => {
                    for h in list {
                        if h.name() == b":status" {
                            println!("Status: {}", String::from_utf8_lossy(h.value()));
                        }
                    }
                }

                Ok((sid, h3::Event::Data)) if sid == stream_id => {
                    let mut chunk = [0; 4096];
                    while let Ok(len) = h3_conn.recv_body(&mut conn, sid, &mut chunk) {
                        body.extend_from_slice(&chunk[..len]);
                    }
                }

                Ok((sid, h3::Event::Finished)) if sid == stream_id => {
                    return Ok(body);
                }

                Err(h3::Error::Done) => break,
                Err(e) => return Err(e.into()),
                _ => {}
            }
        }
    }
}
```

## Complete Example: HTTP/3 Server

```rust
use quiche::h3;
use std::collections::HashMap;

struct HttpRequest {
    headers: Vec<h3::Header>,
    body: Vec<u8>,
    finished: bool,
}

fn handle_client(conn: &mut quiche::Connection) -> Result<(), Box<dyn std::error::Error>> {
    let h3_config = h3::Config::new()?;
    let mut h3_conn = h3::Connection::with_transport(conn, &h3_config)?;
    let mut requests: HashMap<u64, HttpRequest> = HashMap::new();

    loop {
        match h3_conn.poll(conn) {
            Ok((stream_id, h3::Event::Headers { list, has_body })) => {
                requests.insert(stream_id, HttpRequest {
                    headers: list,
                    body: Vec::new(),
                    finished: !has_body,
                });

                if !has_body {
                    send_response(&mut h3_conn, conn, stream_id)?;
                }
            }

            Ok((stream_id, h3::Event::Data)) => {
                if let Some(req) = requests.get_mut(&stream_id) {
                    let mut buf = [0; 4096];
                    while let Ok(len) = h3_conn.recv_body(conn, stream_id, &mut buf) {
                        req.body.extend_from_slice(&buf[..len]);
                    }
                }
            }

            Ok((stream_id, h3::Event::Finished)) => {
                if let Some(req) = requests.get_mut(&stream_id) {
                    req.finished = true;
                    send_response(&mut h3_conn, conn, stream_id)?;
                }
            }

            Err(h3::Error::Done) => break,
            Err(e) => return Err(e.into()),
            _ => {}
        }
    }

    Ok(())
}

fn send_response(
    h3_conn: &mut h3::Connection,
    conn: &mut quiche::Connection,
    stream_id: u64,
) -> Result<(), h3::Error> {
    let headers = vec![
        h3::Header::new(b":status", b"200"),
        h3::Header::new(b"content-type", b"text/html"),
    ];

    h3_conn.send_response(conn, stream_id, &headers, false)?;

    let body = b"<html><body><h1>Hello, HTTP/3!</h1></body></html>";
    h3_conn.send_body(conn, stream_id, body, true)?;

    Ok(())
}
```
