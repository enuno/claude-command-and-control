# quiche - QUIC and HTTP/3 Library

> Rust implementation of QUIC transport protocol and HTTP/3, developed by Cloudflare.

## Quick Reference

### Installation

```toml
# Cargo.toml
[dependencies]
quiche = "0.24"
```

### Build Requirements
- Rust 1.85+ (via rustup)
- CMake (for BoringSSL)
- NASM (Windows only)

### Feature Flags
```toml
[dependencies]
quiche = { version = "0.24", features = ["ffi", "qlog"] }
```

| Feature | Description |
|---------|-------------|
| `default` | BoringSSL vendored build |
| `ffi` | C/C++ FFI API exposure |
| `qlog` | QUIC event logging support |
| `boringssl-boring-crate` | Use boring crate for TLS |

## QUIC Connection Workflow

### 1. Create Configuration

```rust
use quiche::{Config, Connection};

// Create config with QUIC version
let mut config = Config::new(quiche::PROTOCOL_VERSION)?;

// TLS setup
config.load_cert_chain_from_pem_file("cert.crt")?;
config.load_priv_key_from_pem_file("cert.key")?;
config.verify_peer(true);

// Flow control (required - no defaults)
config.set_initial_max_data(10_000_000);
config.set_initial_max_stream_data_bidi_local(1_000_000);
config.set_initial_max_stream_data_bidi_remote(1_000_000);
config.set_initial_max_stream_data_uni(1_000_000);
config.set_initial_max_streams_bidi(100);
config.set_initial_max_streams_uni(100);

// Timeouts
config.set_max_idle_timeout(30_000); // 30 seconds

// ALPN for HTTP/3
config.set_application_protos(quiche::h3::APPLICATION_PROTOCOL)?;
```

### 2. Establish Connection

**Client:**
```rust
let scid = quiche::ConnectionId::from_ref(&scid_bytes);
let mut conn = quiche::connect(
    Some("example.com"),  // SNI
    &scid,
    local_addr,
    peer_addr,
    &mut config,
)?;
```

**Server:**
```rust
let mut conn = quiche::accept(
    &scid,
    None,  // No ODCID for initial
    local_addr,
    peer_addr,
    &mut config,
)?;
```

### 3. Packet I/O Loop

```rust
let mut buf = [0; 65535];
let mut out = [0; 1350];

loop {
    // Receive from socket
    let (read, from) = socket.recv_from(&mut buf)?;

    // Process incoming packet
    let recv_info = quiche::RecvInfo { from, to: local };
    conn.recv(&mut buf[..read], recv_info)?;

    // Generate outgoing packets
    loop {
        let (write, send_info) = match conn.send(&mut out) {
            Ok(v) => v,
            Err(quiche::Error::Done) => break,
            Err(e) => return Err(e),
        };
        socket.send_to(&out[..write], send_info.to)?;
    }

    // Handle timeout
    if let Some(timeout) = conn.timeout() {
        // Set timer for timeout duration
    }

    // Process timeout events
    conn.on_timeout();
}
```

### 4. Stream Operations

```rust
// Send data on stream
let stream_id = 0;  // Client-initiated bidirectional
conn.stream_send(stream_id, b"Hello", true)?;  // true = fin

// Receive data
let mut buf = [0; 1024];
while let Ok((read, fin)) = conn.stream_recv(stream_id, &mut buf) {
    println!("Received {} bytes, fin={}", read, fin);
    if fin { break; }
}

// Check writable streams
for stream_id in conn.writable() {
    let capacity = conn.stream_capacity(stream_id)?;
    // Write up to capacity bytes
}

// Check readable streams
for stream_id in conn.readable() {
    // Read available data
}
```

### 5. Connection Lifecycle

```rust
// Check connection state
if conn.is_established() {
    // Handshake complete, can send/receive data
}

if conn.is_in_early_data() {
    // Can use 0-RTT
}

// Close connection
conn.close(true, 0, b"goodbye")?;

// Continue processing until closed
while !conn.is_closed() {
    // Process remaining packets
}
```

## HTTP/3 Workflow

### 1. Setup HTTP/3 over QUIC

```rust
use quiche::h3;

// Configure QUIC with HTTP/3 ALPN
config.set_application_protos(h3::APPLICATION_PROTOCOL)?;

// After QUIC handshake completes
let h3_config = h3::Config::new()?;
let mut h3_conn = h3::Connection::with_transport(&mut conn, &h3_config)?;
```

### 2. Client: Send Request

```rust
let req = vec![
    h3::Header::new(b":method", b"GET"),
    h3::Header::new(b":scheme", b"https"),
    h3::Header::new(b":authority", b"example.com"),
    h3::Header::new(b":path", b"/"),
    h3::Header::new(b"user-agent", b"quiche"),
];

let stream_id = h3_conn.send_request(&mut conn, &req, true)?;
```

### 3. Server: Handle Request

```rust
loop {
    match h3_conn.poll(&mut conn) {
        Ok((stream_id, h3::Event::Headers { list, has_body })) => {
            // Process request headers
            for header in list {
                println!("{}: {}",
                    String::from_utf8_lossy(header.name()),
                    String::from_utf8_lossy(header.value()));
            }

            // Send response
            let resp = vec![
                h3::Header::new(b":status", b"200"),
                h3::Header::new(b"content-type", b"text/plain"),
            ];
            h3_conn.send_response(&mut conn, stream_id, &resp, false)?;
            h3_conn.send_body(&mut conn, stream_id, b"Hello!", true)?;
        }

        Ok((stream_id, h3::Event::Data)) => {
            let mut buf = [0; 4096];
            while let Ok(read) = h3_conn.recv_body(&mut conn, stream_id, &mut buf) {
                // Process body data
            }
        }

        Ok((stream_id, h3::Event::Finished)) => {
            // Request complete
        }

        Err(h3::Error::Done) => break,
        Err(e) => return Err(e),
    }
}
```

### 4. Client: Receive Response

```rust
loop {
    match h3_conn.poll(&mut conn) {
        Ok((stream_id, h3::Event::Headers { list, .. })) => {
            for header in list {
                if header.name() == b":status" {
                    println!("Status: {}", String::from_utf8_lossy(header.value()));
                }
            }
        }

        Ok((stream_id, h3::Event::Data)) => {
            let mut buf = [0; 4096];
            while let Ok(read) = h3_conn.recv_body(&mut conn, stream_id, &mut buf) {
                println!("Body: {}", String::from_utf8_lossy(&buf[..read]));
            }
        }

        Ok((_, h3::Event::Finished)) => break,
        Err(h3::Error::Done) => break,
        Err(e) => return Err(e),
    }
}
```

## Configuration Reference

### Flow Control Settings

| Method | Description | Recommended |
|--------|-------------|-------------|
| `set_initial_max_data()` | Connection-level buffer | 10 MB |
| `set_initial_max_stream_data_bidi_local()` | Local bidirectional streams | 1 MB |
| `set_initial_max_stream_data_bidi_remote()` | Remote bidirectional streams | 1 MB |
| `set_initial_max_stream_data_uni()` | Unidirectional streams | 1 MB |
| `set_initial_max_streams_bidi()` | Max concurrent bidirectional | 100 |
| `set_initial_max_streams_uni()` | Max concurrent unidirectional | 100 |

### Congestion Control

```rust
use quiche::CongestionControlAlgorithm;

// Available algorithms
config.set_cc_algorithm(CongestionControlAlgorithm::Reno);
config.set_cc_algorithm(CongestionControlAlgorithm::CUBIC);
config.set_cc_algorithm(CongestionControlAlgorithm::BBR);
config.set_cc_algorithm(CongestionControlAlgorithm::BBR2);

// Or by name
config.set_cc_algorithm_name("cubic")?;

// Pacing
config.enable_pacing(true);
config.set_max_pacing_rate(Some(1_000_000)); // bytes/sec
```

### Timeout Settings

```rust
config.set_max_idle_timeout(30_000);      // 30 seconds
config.set_max_ack_delay(25);             // 25 ms
config.set_ack_delay_exponent(3);         // Default: 3
config.set_initial_rtt(Duration::from_millis(333));
```

### DATAGRAM Support

```rust
// Enable DATAGRAM frames
config.enable_dgram(true, 1000, 1000);  // enabled, recv_queue, send_queue

// Send datagram
conn.dgram_send(b"unreliable data")?;

// Receive datagram
let mut buf = [0; 1200];
let len = conn.dgram_recv(&mut buf)?;
```

## Connection Statistics

```rust
let stats = conn.stats();

println!("RTT: {:?}", stats.rtt);
println!("Bytes sent: {}", stats.sent);
println!("Bytes received: {}", stats.recv);
println!("Lost packets: {}", stats.lost);
println!("Congestion window: {}", stats.cwnd);
println!("Delivery rate: {} bytes/sec", stats.delivery_rate);
```

## Path Management

```rust
// Migrate to new address (client only)
conn.migrate(new_local, new_peer)?;

// Probe new path
conn.probe_path(local_addr, peer_addr)?;

// Get path statistics
let path_stats = conn.path_stats(local_addr, peer_addr)?;

// Handle path events
while let Some(event) = conn.path_event_next() {
    match event {
        quiche::PathEvent::New(local, peer) => {
            println!("New path: {} -> {}", local, peer);
        }
        quiche::PathEvent::Validated(local, peer) => {
            println!("Path validated: {} -> {}", local, peer);
        }
        quiche::PathEvent::FailedValidation(local, peer) => {
            println!("Path validation failed");
        }
        quiche::PathEvent::Closed(local, peer) => {
            println!("Path closed");
        }
        quiche::PathEvent::ReusedSourceConnectionId(cid, old, new) => {
            println!("CID reused");
        }
        quiche::PathEvent::PeerMigrated(local, peer) => {
            println!("Peer migrated to new path");
        }
    }
}
```

## Debugging

### qlog Support

```rust
use std::fs::File;

let writer = File::create("connection.qlog")?;
conn.set_qlog(
    Box::new(writer),
    "quiche-app".to_string(),
    format!("Connection {}", conn.trace_id()),
);

// With log level
conn.set_qlog_with_level(
    Box::new(writer),
    "title".to_string(),
    "desc".to_string(),
    quiche::QlogLevel::Extra,
);
```

### Key Logging (TLS)

```rust
use std::fs::File;

let keylog = File::create("keys.log")?;
conn.set_keylog(Box::new(keylog));
```

## Error Handling

```rust
use quiche::Error;

match conn.recv(&mut buf, recv_info) {
    Ok(len) => println!("Processed {} bytes", len),
    Err(Error::Done) => (), // No more work
    Err(Error::BufferTooShort) => println!("Buffer too small"),
    Err(Error::InvalidPacket) => println!("Invalid packet"),
    Err(Error::InvalidState) => println!("Invalid connection state"),
    Err(Error::CryptoFail) => println!("TLS error"),
    Err(Error::TlsFail) => println!("TLS handshake failed"),
    Err(e) => println!("Error: {:?}", e),
}

// HTTP/3 errors
use quiche::h3::Error as H3Error;

match h3_conn.poll(&mut conn) {
    Err(H3Error::Done) => (), // No events
    Err(H3Error::TransportError(e)) => println!("QUIC error: {:?}", e),
    Err(H3Error::StreamBlocked) => println!("Stream blocked"),
    Err(H3Error::FrameError) => println!("Frame error"),
    Err(e) => println!("HTTP/3 error: {:?}", e),
}
```

## Platform Support

| Platform | Status |
|----------|--------|
| Linux | Full support |
| macOS | Full support |
| Windows | Full support (requires NASM) |
| Android | NDK 19+ |
| iOS | Supported |

## Notable Users

- **Cloudflare** - Edge network HTTP/3
- **Android** - DNS-over-HTTP/3 resolver
- **curl** - HTTP/3 backend option

## When to Use This Skill

- Implementing QUIC protocol in Rust applications
- Building HTTP/3 clients or servers
- Low-level QUIC packet handling
- Connection migration and multi-path scenarios
- High-performance networking with congestion control
- Debugging QUIC connections with qlog

## Resources

- [Documentation](https://docs.quic.tech/quiche/)
- [GitHub Repository](https://github.com/cloudflare/quiche)
- [Crates.io](https://crates.io/crates/quiche)
- [QUIC RFC 9000](https://www.rfc-editor.org/rfc/rfc9000)
- [HTTP/3 RFC 9114](https://www.rfc-editor.org/rfc/rfc9114)
