--[[
  Simple Token Example for AO

  This example demonstrates a basic fungible token implementation
  with transfer and balance query functionality.

  Features:
  - Initialize token with name, symbol, and supply
  - Transfer tokens between addresses
  - Query balances
  - View total supply
]]

-- Initialize token state
Token = {
  Name = "MyToken",
  Symbol = "MTK",
  TotalSupply = 1000000,
  Decimals = 6,
  Balances = {}
}

-- Set initial balance to owner
Token.Balances[Owner] = Token.TotalSupply

print("Token initialized: " .. Token.Name .. " (" .. Token.Symbol .. ")")
print("Total Supply: " .. Token.TotalSupply)
print("Owner Balance: " .. Token.Balances[Owner])

--[[
  Transfer Handler

  Tags Required:
    - Action: "Transfer"
    - Recipient: target address
    - Amount: token amount to transfer

  Returns:
    Success: "Transfer successful" with updated balances
    Error: "Insufficient balance" or validation errors
]]
Handlers.add(
  "transfer",
  Handlers.utils.hasMatchingTag("Action", "Transfer"),
  function(msg)
    -- Extract and validate parameters
    local recipient = msg.Tags.Recipient
    local amount = tonumber(msg.Tags.Amount)

    -- Validation
    if not recipient then
      Send({
        Target = msg.From,
        Error = "Recipient address required"
      })
      return
    end

    if not amount or amount <= 0 then
      Send({
        Target = msg.From,
        Error = "Valid amount required (must be positive)"
      })
      return
    end

    -- Check sender balance
    local senderBalance = Token.Balances[msg.From] or 0
    if senderBalance < amount then
      Send({
        Target = msg.From,
        Error = "Insufficient balance",
        Data = json.encode({
          required = amount,
          available = senderBalance
        })
      })
      return
    end

    -- Execute transfer
    Token.Balances[msg.From] = Token.Balances[msg.From] - amount
    Token.Balances[recipient] = (Token.Balances[recipient] or 0) + amount

    -- Send confirmation to sender
    Send({
      Target = msg.From,
      Data = json.encode({
        status = "success",
        from = msg.From,
        to = recipient,
        amount = amount,
        newBalance = Token.Balances[msg.From]
      })
    })

    -- Notify recipient
    Send({
      Target = recipient,
      Action = "Credit-Notice",
      From = msg.From,
      Amount = tostring(amount),
      Data = json.encode({
        status = "received",
        from = msg.From,
        amount = amount,
        newBalance = Token.Balances[recipient]
      })
    })

    print(string.format("Transfer: %s → %s (%d %s)",
      msg.From, recipient, amount, Token.Symbol))
  end
)

--[[
  Balance Query Handler

  Tags Required:
    - Action: "Balance"
    - Target: (optional) address to check (defaults to msg.From)

  Returns:
    Balance information for the specified address
]]
Handlers.add(
  "balance",
  Handlers.utils.hasMatchingTag("Action", "Balance"),
  function(msg)
    local target = msg.Tags.Target or msg.From
    local balance = Token.Balances[target] or 0

    Send({
      Target = msg.From,
      Data = json.encode({
        address = target,
        balance = balance,
        symbol = Token.Symbol
      })
    })
  end
)

--[[
  Info Handler

  Tags Required:
    - Action: "Info"

  Returns:
    Token metadata and total supply
]]
Handlers.add(
  "info",
  Handlers.utils.hasMatchingTag("Action", "Info"),
  function(msg)
    Send({
      Target = msg.From,
      Data = json.encode({
        name = Token.Name,
        symbol = Token.Symbol,
        totalSupply = Token.TotalSupply,
        decimals = Token.Decimals
      })
    })
  end
)

--[[
  Balances Handler (for external queries)

  Tags Required:
    - Action: "Balances"

  Returns:
    All non-zero balances
]]
Handlers.add(
  "balances",
  Handlers.utils.hasMatchingTag("Action", "Balances"),
  function(msg)
    Send({
      Target = msg.From,
      Data = json.encode(Token.Balances)
    })
  end
)

-- Usage Examples:

--[[
  1. Transfer tokens:

  Send({
    Target = "<this-process-id>",
    Action = "Transfer",
    Recipient = "<recipient-address>",
    Amount = "100"
  })

  2. Check balance:

  Send({
    Target = "<this-process-id>",
    Action = "Balance"
  })

  3. Check someone else's balance:

  Send({
    Target = "<this-process-id>",
    Action = "Balance",
    Target = "<address-to-check>"
  })

  4. Get token info:

  Send({
    Target = "<this-process-id>",
    Action = "Info"
  })

  5. Get all balances:

  Send({
    Target = "<this-process-id>",
    Action = "Balances"
  })
]]

-- Custom prompt showing token info
function Prompt()
  local ownerBalance = Token.Balances[Owner] or 0
  return string.format("💰 %s | Balance: %d | Inbox: %d > ",
    Token.Symbol, ownerBalance, #Inbox)
end

print("✅ Token handlers loaded successfully")
print("Use Prompt() to see custom prompt")
