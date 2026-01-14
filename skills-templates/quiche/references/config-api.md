# quiche Config API Reference

Complete reference for the `quiche::Config` struct - configuration shared across QUIC connections.

## Creation

### `Config::new()`
Creates a new configuration with specified QUIC version.

```rust
pub fn new(version: u32) -> Result<Config>
```

**Example:**
```rust
let mut config = Config::new(quiche::PROTOCOL_VERSION)?;
```

### `Config::with_boring_ssl_ctx_builder()`
Creates config with custom BoringSSL context (feature-gated).

```rust
pub fn with_boring_ssl_ctx_builder(
    version: u32,
    builder: fn(&mut boring::ssl::SslContextBuilder) -> Result<(), boring::error::ErrorStack>,
) -> Result<Config>
```

## TLS Configuration

### Certificate Loading

```rust
// Load certificate chain from PEM file
pub fn load_cert_chain_from_pem_file(&mut self, file: &str) -> Result<()>

// Load private key from PEM file
pub fn load_priv_key_from_pem_file(&mut self, file: &str) -> Result<()>

// Configure trusted CA certificates
pub fn load_verify_locations_from_file(&mut self, file: &str) -> Result<()>
pub fn load_verify_locations_from_directory(&mut self, dir: &str) -> Result<()>
```

**Example:**
```rust
config.load_cert_chain_from_pem_file("server.crt")?;
config.load_priv_key_from_pem_file("server.key")?;
config.load_verify_locations_from_file("ca.crt")?;
```

### Peer Verification

```rust
// Enable/disable peer certificate verification
pub fn verify_peer(&mut self, verify: bool)
```

### Session Tickets

```rust
// Set session ticket encryption key (48 bytes)
pub fn set_ticket_key(&mut self, key: &[u8]) -> Result<()>
```

### Key Logging

```rust
// Enable TLS key logging (for debugging with Wireshark)
pub fn log_keys(&mut self)
```

## ALPN Configuration

### `set_application_protos()`
Sets ALPN protocols for negotiation.

```rust
pub fn set_application_protos(&mut self, protos: &[&[u8]]) -> Result<()>
```

**Example:**
```rust
// HTTP/3
config.set_application_protos(quiche::h3::APPLICATION_PROTOCOL)?;

// Custom protocols
config.set_application_protos(&[b"myproto", b"fallback"])?;
```

### `set_application_protos_wire_format()`
Sets ALPN in wire format.

```rust
pub fn set_application_protos_wire_format(&mut self, protos: &[u8]) -> Result<()>
```

## Flow Control

### Connection-Level

```rust
// Maximum data that can be received on the connection
pub fn set_initial_max_data(&mut self, v: u64)

// Maximum connection-level window size
pub fn set_max_connection_window(&mut self, v: u64)
```

### Stream-Level

```rust
// Bidirectional streams (locally-initiated)
pub fn set_initial_max_stream_data_bidi_local(&mut self, v: u64)

// Bidirectional streams (remotely-initiated)
pub fn set_initial_max_stream_data_bidi_remote(&mut self, v: u64)

// Unidirectional streams
pub fn set_initial_max_stream_data_uni(&mut self, v: u64)

// Maximum stream-level window size
pub fn set_max_stream_window(&mut self, v: u64)
```

### Stream Counts

```rust
// Maximum concurrent bidirectional streams
pub fn set_initial_max_streams_bidi(&mut self, v: u64)

// Maximum concurrent unidirectional streams
pub fn set_initial_max_streams_uni(&mut self, v: u64)
```

**Recommended Values:**
```rust
config.set_initial_max_data(10_000_000);           // 10 MB
config.set_initial_max_stream_data_bidi_local(1_000_000);  // 1 MB
config.set_initial_max_stream_data_bidi_remote(1_000_000); // 1 MB
config.set_initial_max_stream_data_uni(1_000_000); // 1 MB
config.set_initial_max_streams_bidi(100);
config.set_initial_max_streams_uni(100);
```

## Congestion Control

### Algorithm Selection

```rust
// Set by enum
pub fn set_cc_algorithm(&mut self, algo: CongestionControlAlgorithm)

// Set by name
pub fn set_cc_algorithm_name(&mut self, name: &str) -> Result<()>
```

**Available Algorithms:**
```rust
use quiche::CongestionControlAlgorithm;

config.set_cc_algorithm(CongestionControlAlgorithm::Reno);   // TCP Reno
config.set_cc_algorithm(CongestionControlAlgorithm::CUBIC);  // CUBIC
config.set_cc_algorithm(CongestionControlAlgorithm::BBR);    // BBRv1
config.set_cc_algorithm(CongestionControlAlgorithm::BBR2);   // BBRv2

// Or by name
config.set_cc_algorithm_name("cubic")?;
config.set_cc_algorithm_name("bbr")?;
config.set_cc_algorithm_name("bbr2")?;
config.set_cc_algorithm_name("reno")?;
```

### Initial Congestion Window

```rust
// Set initial cwnd in packets
pub fn set_initial_congestion_window_packets(&mut self, packets: usize)
```

### HyStart++

```rust
// Enable HyStart++ slow start algorithm
pub fn enable_hystart(&mut self, v: bool)
```

### Pacing

```rust
// Enable packet pacing
pub fn enable_pacing(&mut self, v: bool)

// Set maximum pacing rate (bytes/sec)
pub fn set_max_pacing_rate(&mut self, rate: Option<u64>)
```

## Timeout Configuration

### Idle Timeout

```rust
// Maximum idle timeout in milliseconds
pub fn set_max_idle_timeout(&mut self, v: u64)
```

### ACK Delay

```rust
// Maximum ACK delay in milliseconds
pub fn set_max_ack_delay(&mut self, v: u64)

// ACK delay exponent (default: 3)
pub fn set_ack_delay_exponent(&mut self, v: u64)
```

### Initial RTT

```rust
// Initial round-trip time estimate
pub fn set_initial_rtt(&mut self, rtt: Duration)
```

**Example:**
```rust
config.set_max_idle_timeout(30_000);  // 30 seconds
config.set_max_ack_delay(25);         // 25 ms
config.set_initial_rtt(Duration::from_millis(100));
```

## UDP/Packet Configuration

### Payload Size

```rust
// Maximum UDP payload size to receive
pub fn set_max_recv_udp_payload_size(&mut self, v: usize)

// Maximum UDP payload size to send
pub fn set_max_send_udp_payload_size(&mut self, v: usize)
```

### Path MTU Discovery

```rust
// Enable PMTU discovery
pub fn discover_pmtu(&mut self, v: bool)
```

## DATAGRAM Support

```rust
// Enable DATAGRAM frames
pub fn enable_dgram(
    &mut self,
    enabled: bool,
    recv_queue_len: usize,
    send_queue_len: usize,
)
```

**Example:**
```rust
config.enable_dgram(true, 1000, 1000);
```

## Early Data (0-RTT)

```rust
// Enable 0-RTT early data
pub fn enable_early_data(&mut self)
```

## Connection Migration

```rust
// Disable active connection migration
pub fn set_disable_active_migration(&mut self, v: bool)
```

## Connection IDs

```rust
// Set active connection ID limit
pub fn set_active_connection_id_limit(&mut self, v: u64)

// Disable destination CID reuse
pub fn set_disable_dcid_reuse(&mut self, v: bool)
```

## Stateless Reset

```rust
// Set stateless reset token (16 bytes)
pub fn set_stateless_reset_token(&mut self, token: Option<u128>)
```

## Anti-Amplification

```rust
// Set maximum amplification factor (default: 3)
pub fn set_max_amplification_factor(&mut self, v: usize)
```

## GREASE

```rust
// Enable GREASE values for protocol robustness
pub fn grease(&mut self, v: bool)
```

## Advanced Settings

### Send Capacity

```rust
// Set send capacity factor multiplier
pub fn set_send_capacity_factor(&mut self, v: f64)
```

### PATH_CHALLENGE Queue

```rust
// Set max PATH_CHALLENGE receive queue length
pub fn set_path_challenge_recv_max_queue_len(&mut self, v: usize)
```

### Loss Detection

```rust
// Enable relaxed loss threshold
pub fn set_enable_relaxed_loss_threshold(&mut self, v: bool)
```

### Unknown Transport Parameters

```rust
// Track unknown transport parameters with size limit
pub fn enable_track_unknown_transport_parameters(&mut self, max_size: usize)
```

## Complete Configuration Example

```rust
use quiche::{Config, CongestionControlAlgorithm};
use std::time::Duration;

fn create_server_config() -> Result<Config, quiche::Error> {
    let mut config = Config::new(quiche::PROTOCOL_VERSION)?;

    // TLS
    config.load_cert_chain_from_pem_file("server.crt")?;
    config.load_priv_key_from_pem_file("server.key")?;
    config.verify_peer(false);

    // ALPN for HTTP/3
    config.set_application_protos(quiche::h3::APPLICATION_PROTOCOL)?;

    // Flow control
    config.set_initial_max_data(10_000_000);
    config.set_initial_max_stream_data_bidi_local(1_000_000);
    config.set_initial_max_stream_data_bidi_remote(1_000_000);
    config.set_initial_max_stream_data_uni(1_000_000);
    config.set_initial_max_streams_bidi(100);
    config.set_initial_max_streams_uni(100);

    // Congestion control
    config.set_cc_algorithm(CongestionControlAlgorithm::BBR2);
    config.enable_hystart(true);
    config.enable_pacing(true);

    // Timeouts
    config.set_max_idle_timeout(30_000);
    config.set_initial_rtt(Duration::from_millis(100));

    // DATAGRAM support
    config.enable_dgram(true, 1000, 1000);

    // 0-RTT
    config.enable_early_data();

    Ok(config)
}

fn create_client_config() -> Result<Config, quiche::Error> {
    let mut config = Config::new(quiche::PROTOCOL_VERSION)?;

    // TLS
    config.load_verify_locations_from_file("ca.crt")?;
    config.verify_peer(true);

    // ALPN for HTTP/3
    config.set_application_protos(quiche::h3::APPLICATION_PROTOCOL)?;

    // Flow control (same as server)
    config.set_initial_max_data(10_000_000);
    config.set_initial_max_stream_data_bidi_local(1_000_000);
    config.set_initial_max_stream_data_bidi_remote(1_000_000);
    config.set_initial_max_stream_data_uni(1_000_000);
    config.set_initial_max_streams_bidi(100);
    config.set_initial_max_streams_uni(100);

    // Congestion control
    config.set_cc_algorithm(CongestionControlAlgorithm::CUBIC);

    // Timeouts
    config.set_max_idle_timeout(30_000);

    Ok(config)
}
```
