/*
  Unit tests for the main library.
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Mocking data libraries.
// const mockData = require('./mocks/util-mocks')

// Unit under test
const MinimalBCHWallet = require('../../index')
// const uut = new MinimalBCHWallet()
let uut

describe('#index.js - Minimal BCH Wallet', () => {
  let sandbox

  // Restore the sandbox before each test.
  beforeEach(async () => {
    sandbox = sinon.createSandbox()

    uut = new MinimalBCHWallet()
    await uut.walletInfoPromise
  })

  afterEach(() => sandbox.restore())

  describe('#create', () => {
    it('should create a new wallet with no input', async () => {
      const walletInfoPromise = uut.create()
      await walletInfoPromise
      // console.log('walletInfo: ', uut.walletInfo)

      assert.property(uut, 'walletInfo')
      assert.property(uut, 'walletInfoPromise')
      assert.property(uut, 'walletInfoCreated')
      assert.equal(uut.walletInfoCreated, true)

      assert.property(uut.walletInfo, 'mnemonic')
      assert.isString(uut.walletInfo.mnemonic)
      assert.isNotEmpty(uut.walletInfo.mnemonic)

      assert.property(uut.walletInfo, 'privateKey')
      assert.isString(uut.walletInfo.privateKey)
      assert.isNotEmpty(uut.walletInfo.privateKey)

      assert.property(uut.walletInfo, 'cashAddress')
      assert.isString(uut.walletInfo.cashAddress)
      assert.isNotEmpty(uut.walletInfo.cashAddress)

      assert.property(uut.walletInfo, 'legacyAddress')
      assert.isString(uut.walletInfo.legacyAddress)
      assert.isNotEmpty(uut.walletInfo.legacyAddress)

      assert.property(uut.walletInfo, 'slpAddress')
      assert.isString(uut.walletInfo.slpAddress)
      assert.isNotEmpty(uut.walletInfo.slpAddress)
    })
  })

  describe('#constructor', () => {
    it('should create a new wallet without encrypted mnemonic', async () => {
      const uut = new MinimalBCHWallet()
      await uut.walletInfoPromise
      // console.log('uut: ', uut)

      assert.property(uut, 'walletInfo')
      assert.property(uut, 'walletInfoPromise')
      assert.property(uut, 'walletInfoCreated')
      assert.equal(uut.walletInfoCreated, true)

      assert.property(uut.walletInfo, 'mnemonic')
      assert.isString(uut.walletInfo.mnemonic)
      assert.isNotEmpty(uut.walletInfo.mnemonic)

      assert.property(uut.walletInfo, 'privateKey')
      assert.isString(uut.walletInfo.privateKey)
      assert.isNotEmpty(uut.walletInfo.privateKey)

      assert.property(uut.walletInfo, 'cashAddress')
      assert.isString(uut.walletInfo.cashAddress)
      assert.isNotEmpty(uut.walletInfo.cashAddress)

      assert.property(uut.walletInfo, 'legacyAddress')
      assert.isString(uut.walletInfo.legacyAddress)
      assert.isNotEmpty(uut.walletInfo.legacyAddress)

      assert.property(uut.walletInfo, 'slpAddress')
      assert.isString(uut.walletInfo.slpAddress)
      assert.isNotEmpty(uut.walletInfo.slpAddress)

      assert.notProperty(uut, 'mnemonicEncrypted')
      assert.notProperty(uut.walletInfo, 'mnemonicEncrypted')
    })

    it('should create a new wallet with encrypted mnemonic', async () => {
      const uut = new MinimalBCHWallet(null, { password: 'myStrongPassword' })
      await uut.walletInfoPromise
      // console.log('uut: ', uut)

      assert.property(uut.walletInfo, 'mnemonic')
      assert.isString(uut.walletInfo.mnemonic)
      assert.isNotEmpty(uut.walletInfo.mnemonic)

      assert.property(uut.walletInfo, 'privateKey')
      assert.isString(uut.walletInfo.privateKey)
      assert.isNotEmpty(uut.walletInfo.privateKey)

      assert.property(uut.walletInfo, 'cashAddress')
      assert.isString(uut.walletInfo.cashAddress)
      assert.isNotEmpty(uut.walletInfo.cashAddress)

      assert.property(uut.walletInfo, 'legacyAddress')
      assert.isString(uut.walletInfo.legacyAddress)
      assert.isNotEmpty(uut.walletInfo.legacyAddress)

      assert.property(uut.walletInfo, 'slpAddress')
      assert.isString(uut.walletInfo.slpAddress)
      assert.isNotEmpty(uut.walletInfo.slpAddress)

      assert.property(uut.walletInfo, 'mnemonicEncrypted')
      assert.isString(uut.walletInfo.mnemonicEncrypted)
      assert.isNotEmpty(uut.walletInfo.mnemonicEncrypted)
    })

    it('should decrypt an encrypted mnemonic', async () => {
      const mnemonicEncrypted =
        'U2FsdGVkX18uyavim4FoIETcRxgOi1E/XFc1ARR3k6HVrJgH60YnLxjbs6yMnWMjpaqbBmSC3uYjhZ+cgFlndOEZI34T0sWFfL952CHCFjd2AjypCjFhqkmHzOCCkhgf'
      const mnemonic =
        'negative prepare champion corn bean proof one same column water warm melt'
      const password = 'myStrongPassword'

      const uut = new MinimalBCHWallet(mnemonicEncrypted, {
        password: password
      })
      await uut.walletInfoPromise
      // console.log('uut: ', uut)

      assert.equal(uut.walletInfo.mnemonic, mnemonic)
    })

    it('should throw error if incorrect password', async () => {
      try {
        const mnemonicEncrypted =
          'U2FsdGVkX18uyavim4FoIETcRxgOi1E/XFc1ARR3k6HVrJgH60YnLxjbs6yMnWMjpaqbBmSC3uYjhZ+cgFlndOEZI34T0sWFfL952CHCFjd2AjypCjFhqkmHzOCCkhgf'

        const uut = new MinimalBCHWallet(mnemonicEncrypted, {
          password: 'bad password'
        })
        await uut.walletInfoPromise

        assert.notProperty(uut.walletInfo, 'mnemonic', 'Unexpected result!')
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'Wrong password')
      }
    })

    it('should import clear-text wallet mnemonic', async () => {
      const mnemonic =
        'negative prepare champion corn bean proof one same column water warm melt'

      const uut = new MinimalBCHWallet(mnemonic)
      await uut.walletInfoPromise
      // console.log('uut: ', uut)

      assert.property(uut.walletInfo, 'mnemonic')
      assert.isString(uut.walletInfo.mnemonic)
      assert.isNotEmpty(uut.walletInfo.mnemonic)
      assert.equal(uut.walletInfo.mnemonic, mnemonic)

      assert.property(uut.walletInfo, 'privateKey')
      assert.isString(uut.walletInfo.privateKey)
      assert.isNotEmpty(uut.walletInfo.privateKey)

      assert.property(uut.walletInfo, 'cashAddress')
      assert.isString(uut.walletInfo.cashAddress)
      assert.isNotEmpty(uut.walletInfo.cashAddress)

      assert.property(uut.walletInfo, 'legacyAddress')
      assert.isString(uut.walletInfo.legacyAddress)
      assert.isNotEmpty(uut.walletInfo.legacyAddress)

      assert.property(uut.walletInfo, 'slpAddress')
      assert.isString(uut.walletInfo.slpAddress)
      assert.isNotEmpty(uut.walletInfo.slpAddress)

      assert.notProperty(uut.walletInfo, 'mnemonicEncrypted')
    })
  })

  describe('#getBalance', () => {
    it('should return combined balance', async () => {
      // Mock live network call.
      sandbox.stub(uut.bchjs.Electrumx, 'balance').resolves({
        success: true,
        balance: {
          confirmed: 1000,
          unconfirmed: 0
        }
      })

      const addr = 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3'

      const balance = await uut.getBalance(addr)

      assert.equal(balance, 1000)
    })
  })

  describe('#getTransactions', () => {
    it('should get transactions', async () => {
      // Mock live network calls
      sandbox.stub(uut.bchjs.Electrumx, 'transactions').resolves({
        success: true,
        transactions: [
          {
            height: 603416,
            tx_hash:
              'eef683d236d88e978bd406419f144057af3fe1b62ef59162941c1a9f05ded62c'
          }
        ]
      })

      const addr = 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3'

      const transactions = await uut.getTransactions(addr)
      // console.log(`transactions: ${JSON.stringify(transactions, null, 2)}`)

      assert.isArray(transactions)
    })
  })

  describe('#send', () => {
    it('should broadcast a transaction and return a txid', async () => {
      const txid =
        '66b7d1fced6df27feb7faf305de2e3d6470decb0276648411fd6a2f69fec8543'

      // Mock live network calls.
      sandbox.stub(uut.sendBch, 'sendBch').resolves(txid)

      const output = await uut.send()

      assert.equal(output, txid)
    })

    it('should throw an error if there is an issue with broadcasting a tx', async () => {
      try {
        // Mock live network calls.
        sandbox.stub(uut.sendBch, 'sendBch').throws(new Error('error message'))

        await uut.send()

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'error message')
      }
    })
  })
})
