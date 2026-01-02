---
name: weavedb
description: Decentralized database protocol with zero-knowledge proofs and permanent storage
version: 1.1.0
---

# WeaveDB Skill

Comprehensive assistance with WeaveDB - a decentralized database protocol built on Arweave with zero-knowledge proofs, permanent storage, and configuration-driven design.

## When to Use This Skill

This skill should be triggered when:
- Building decentralized applications with permanent data storage
- Implementing WeaveDB databases with schema validation
- Creating social dapps or data-driven applications
- Setting up WeaveDB local nodes or deployments
- Working with WeaveDB authentication and authorization rules
- Integrating WeaveDB with Next.js or React frontends
- Debugging WeaveDB queries or configuration issues
- Learning WeaveDB best practices and patterns

## Quick Reference

### Common Patterns

#### 1. Project Initialization
```bash
npx wdb-cli create mydb && cd mydb
```

#### 2. Basic Database Setup
```javascript
import { DB } from "wdb-sdk"
import { mem } from "wdb-core"

const { q } = mem()
const db = new DB({ jwk: acc[0].jwk, hb: null, mem: q })

// Initialize database
const id = await db.init({ id: "mydb" })

// Create collection with schema
await db.mkdir({
  name: "users",
  schema: { type: "object", required: ["name", "age"] },
  auth: [["set:user,del:user", [["allow()"]]]],
})
```

#### 3. CRUD Operations
```javascript
// Create
await db.set("set:user", { name: "Bob", age: 20 }, "users", "Bob")

// Read (single document)
const user = await db.get("users", "Bob")

// Read (all documents, sorted)
const users = await db.get("users", ["age", "desc"])

// Read (with limit)
const topUsers = await db.get("users", ["age", "asc"], 2)

// Read (with query)
const thirtyYearOlds = await db.get("users", ["age", "==", 30])

// Delete
await db.set("del:user", "users", "Bob")
```

#### 4. Local Node Deployment
```bash
# Clone HyperBEAM
git clone -b weavedb https://github.com/weavedb/HyperBEAM.git
cd HyperBEAM

# Start node
yarn start

# Deploy database (in separate terminal)
cd mydb
yarn deploy --wallet .wallet.json
```

### Example Code Patterns

**Example 1 - In-Memory Testing** (javascript):
```javascript
import assert from "assert"
import { describe, it } from "node:test"
import { acc } from "wao/test"
import { DB } from "wdb-sdk"
import { mem } from "wdb-core"

describe("Basic API", () => {
  it("should query DB", async () => {
    const { q } = mem()
    const db = new DB({ jwk: acc[0].jwk, hb: null, mem: q })

    const id = await db.init({ id: "mydb" })

    await db.mkdir({
      name: "users",
      schema: { type: "object", required: ["name", "age"] },
      auth: [["set:user,del:user", [["allow()"]]]],
    })

    await db.set("set:user", { name: "Bob", age: 20 }, "users", "Bob")
    const user = await db.get("users", "Bob")
    assert.deepEqual(user, { name: "Bob", age: 20 })
  })
})
```

**Example 2 - Schema Definition** (javascript):
```javascript
// /db/schema.js
export default {
  notes: {
    type: "object",
    required: ["id", "actor", "content", "published", "likes"],
    properties: {
      id: { type: "string" },
      actor: { type: "string", pattern: "^[a-zA-Z0-9_-]{43}$" },
      content: { type: "string", minLength: 1, maxLength: 140 },
      published: { type: "integer" },
      likes: { type: "integer" },
    },
    additionalProperties: false,
  },
}
```

**Example 3 - Authentication Rules** (javascript):
```javascript
// /db/auth.js
export default {
  notes: [
    [
      "add:note",
      [
        ["fields()", ["*content"]],
        ["mod()", { id: "$doc", actor: "$signer", published: "$ts", likes: 0 }],
        ["allow()"],
      ],
    ],
  ],
}
```

**Example 4 - Database Triggers** (javascript):
```javascript
// /db/triggers.js
export default {
  likes: [
    {
      key: "inc_likes",
      on: "create",
      fn: [
        ["update()", [{ likes: { _$: ["inc"] } }, "notes", "$after.object"]],
      ],
    },
  ],
}
```

**Example 5 - Frontend Integration (Next.js)** (javascript):
```javascript
import { useRef, useEffect, useState } from "react"
import { DB } from "wdb-sdk"

export default function Home() {
  const [notes, setNotes] = useState([])
  const db = useRef()

  const getNotes = async () => {
    const _notes = await db.current.cget("notes", ["published", "desc"], 10)
    setNotes(_notes)
  }

  const handlePost = async (content) => {
    if (window.arweaveWallet) {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"])
    }
    const res = await db.current.set("add:note", { content }, "notes")
    if (res.success) {
      await getNotes()
    }
  }

  useEffect(() => {
    void (async () => {
      db.current = new DB({
        id: process.env.NEXT_PUBLIC_DB_ID,
        url: process.env.NEXT_PUBLIC_RU_URL,
      })
      await getNotes()
    })()
  }, [])

  return (
    // UI components...
  )
}
```

**Example 6 - Package Installation** (bash):
```bash
# For Node.js projects
yarn add wdb-sdk

# Or with npm
npm install wdb-sdk

# For testing utilities
yarn add arjson wao
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **llms-full.md** - Complete WeaveDB documentation (398 KB)
- **llms.md** - Standard WeaveDB documentation
- **other.md** - Additional resources
- **index.md** - Quick navigation index

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners: Quick Start Guide

1. **Create a new project:**
   ```bash
   npx wdb-cli create mydb && cd mydb
   ```

2. **Run tests to verify setup:**
   ```bash
   yarn test-all
   ```

3. **Deploy locally:**
   ```bash
   yarn start
   yarn deploy --wallet .wallet.json
   ```

4. **Access explorer:**
   ```bash
   cd ../weavedb/scan && yarn && yarn dev --port 4000
   ```

### For Social Dapp Development

Follow the complete social dapp tutorial in the quick-start guide:
- Define schemas for notes and likes
- Set up authentication rules with custom permissions
- Configure indexes for efficient querying
- Implement triggers for automatic updates
- Build a Next.js frontend with wallet integration

### For Production Deployment

- **Local Node:** Run HyperBEAM and Rollup nodes
- **Database Deployment:** Use `yarn deploy` with wallet
- **Explorer:** Set up WeaveDB scanner for monitoring
- **Frontend:** Configure environment variables for DB ID and RU URL

### For Code Examples

The quick reference section above contains practical patterns extracted from the official quick-start guide, including:
- Database initialization and configuration
- CRUD operations with queries
- Schema validation
- Authentication and authorization
- Frontend integration
- Testing patterns

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed API explanations
- Complete quick-start tutorials
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks like:
- Database deployment automation
- Test suite runners
- Schema validators

### assets/
Add templates, boilerplate, or example projects here:
- Social dapp template
- Authentication configurations
- Frontend component libraries

## Key Architecture Patterns

WeaveDB leverages several powerful patterns:

1. **Configuration-Driven Design:** No smart contracts - use JSON configuration for schema, auth, indexes, and triggers
2. **JSON Schema Validation:** Type-safe data with automatic validation
3. **Custom Query Types:** Define permissions like `add:note`, `del:user` for fine-grained access control
4. **Multi-Field Indexes:** Efficient querying across multiple fields
5. **Trigger-Based Automation:** Event-driven updates (e.g., auto-increment like counters)
6. **FPJSON Programming:** Declarative JSON-based logic for both manual and AI-assisted development

## Common Use Cases

- **Social Networks:** Build Twitter-like apps with posts, likes, follows
- **Marketplaces:** Create decentralized e-commerce with products, orders, reviews
- **Gaming:** Store game state, player profiles, leaderboards
- **DAOs:** Manage proposals, votes, member records
- **Content Platforms:** Blogs, forums, wiki systems
- **Analytics:** Store events, metrics, user behavior data

## Testing

Run the complete test suite:
```bash
yarn test-all
```

Write tests using Node.js test framework:
```javascript
import { describe, it } from "node:test"
import assert from "assert"
import { DB } from "wdb-sdk"
import { mem } from "wdb-core"

describe("My Feature", () => {
  it("should work correctly", async () => {
    const { q } = mem()
    const db = new DB({ jwk: acc[0].jwk, hb: null, mem: q })
    // Your test logic...
  })
})
```

## Troubleshooting

**Database not initializing:**
- Verify `wdb-sdk` is installed
- Check wallet file exists for deployments
- Ensure HyperBEAM node is running (for local deployment)

**Schema validation failing:**
- Review JSON Schema syntax in `/db/schema.js`
- Check required fields match data structure
- Verify pattern regex for string fields

**Authentication errors:**
- Review auth rules in `/db/auth.js`
- Ensure custom permission types are defined
- Check signer/actor addresses match

**Query not returning expected results:**
- Verify indexes are configured for query fields
- Check query syntax (field, operator, value)
- Review sort order and limit parameters

## Notes

- This skill was automatically generated from official documentation and enhanced with quick-start content
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from the official quick-start guide
- Version 1.1.0 adds comprehensive quick-start examples and social dapp patterns

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper: `/create-skill --config configs/weavedb.json`
2. Enhance with latest quick-start: `/skill-enhancer weavedb https://docs.weavedb.dev/build/quick-start`
3. The skill will be rebuilt with the latest information

## Version History

- **1.1.0** (2026-01-02): Added comprehensive quick-start guide
  - Project initialization examples
  - Social dapp complete tutorial
  - Frontend integration patterns
  - Authentication and trigger examples
  - Expanded code examples from 2 to 6

- **1.0.0** (2026-01-02): Initial skill creation
  - Basic WeaveDB documentation integration
  - llms.txt content extraction (398 KB)
