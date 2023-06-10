const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;

    let address;
    let flag = false;
    let wallet;

    while (!flag) {
      wallet = ethers.Wallet.createRandom();
      address = wallet.address;
      if (address < threshold) {
        flag = true;
        wallet = wallet.connect(ethers.provider); // Assign the provider to the wallet object

        //fund wallet
        const signer = ethers.provider.getSigner(0);
        await signer.sendTransaction({
          to: wallet.address,
          value: ethers.utils.parseEther('1'),
        });
      }
    }

    return { game, wallet };
  }

  it('should be a winner', async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    // good luck
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
