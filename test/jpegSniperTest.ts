import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Exploiter", function () {
    async function deployExploiter() {
        const [contractAdmin, attacker] = await ethers.getSigners();

        const FlatLaunchpeg = await ethers.getContractFactory('FlatLaunchpeg')
        const flatLaunchpeg = await FlatLaunchpeg.connect(contractAdmin).deploy(69,5,5)

        return { contractAdmin, attacker, flatLaunchpeg };
    }

    describe("flatLaunchpeg contract", function () {
        it("It should exploit flatLaunchpeg", async function () {
            const { contractAdmin, attacker, flatLaunchpeg } = await loadFixture(deployExploiter);
            const ExploiterContract = await ethers.getContractFactory("jpegSniperExploiter")
            const exploiterContract = await ExploiterContract.connect(attacker).deploy(flatLaunchpeg.address, await attacker.getAddress())
            await exploiterContract.deployed()

            expect(await flatLaunchpeg.totalSupply()).to.be.equal(69)
            console.log(await flatLaunchpeg.totalSupply(), "Total supply of ERC721 token")
            expect(await flatLaunchpeg.balanceOf(await attacker.getAddress())).to.be.equal(69)
            console.log(await flatLaunchpeg.balanceOf(await attacker.getAddress()), "Token balance after exploit")
        })

    })
})