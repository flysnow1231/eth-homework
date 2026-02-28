// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "hardhat/console.sol";
import "./BlindBoxManager.sol";
import "./IPriceManager.sol";

contract AkaNft is Initializable, ERC721Upgradeable , OwnableUpgradeable,UUPSUpgradeable{
    // ============ 状态变量 ============
    uint256 public totalSupply;
    uint256 public maxSupply;

    //肓盒id => 肓盒稀缺度
    mapping(uint256 => uint) private blindBoxRarity;

    //肓盒id => ipfs uri
    mapping(uint256 => string) private blindBoxURIs;

    //已售肓盒一览
    mapping(uint256 => BlindBoxManager.BlindBox) private purchasedIdBlindBox;

    //拍卖中肓盒一览
    mapping(uint256 => BlindBoxManager.BlindBox) private blindBoxOnSale;

    //竞拍中的肓盒最高出价
    mapping(uint256 => uint256) private blindBoxBidPrice;

    //竞拍中的肓盒最高出价者
    mapping(uint256 => address) private blindBoxBidder;

    IPriceManager public priceManager;

    event DebugBox(string id, BlindBoxManager.BlindBox box);
    event Debug(uint256 id, string content);
    



    function initialize(address priceManagerAddress, uint256 maxSupplyParam) public initializer {
        __ERC721_init("BlindBox", "BB");
        maxSupply = maxSupplyParam;
        priceManager = IPriceManager(priceManagerAddress);
        __Ownable_init(msg.sender);
    }

    /**
     * 购买nft.
     * 身份验证后，mint，存储会员，nft token信息。
     */
    function purseNft() external returns (bool) {
        //require(msg.sender != owner(), "Admin cannot buy blind box");
        //todo 白名单验证
        if (totalSupply >= maxSupply) {
            console.log("Blind Box Soldout!");
            return false;
        }
        uint256 blindBoxId = totalSupply;
        totalSupply++;

        _safeMint(msg.sender, blindBoxId);
        purchasedIdBlindBox[blindBoxId] = BlindBoxManager.createBlindBox();
        emit DebugBox(
            "one box pursed.id=, buyer=",
            purchasedIdBlindBox[blindBoxId]
        );
        return true;
    }

    /**
     * 肓盒持有者上架拍卖肓盒。
     */
    function openBoxOnSale(uint256 blindBoxId) external returns (bool) {
        //验证权限，判断该会员是否持有该肓盒。
        require(
            msg.sender == _ownerOf(blindBoxId),
            "box not found."
        );
        //判断purchasedIdBlindBox是否存在
        require(
            purchasedIdBlindBox[blindBoxId].purchased,
            "BlindBox not exist"
        );
        //拍卖上架
        require(
            !purchasedIdBlindBox[blindBoxId].auctioned,
            "BlindBox already auctioned"
        );
        BlindBoxManager.BlindBox storage box = purchasedIdBlindBox[blindBoxId];
        box.auctioned = true;
        blindBoxOnSale[blindBoxId] = box;
        emit DebugBox("openBoxOnSale.", blindBoxOnSale[blindBoxId]);

        //safeTransferFrom(msg.sender, address(this), blindBoxId);
        return true;
    }

    /**
     * 竞拍。
     * currency: 1. eth. 2 doge.
     */
    function placeBid(
        uint256 blindBoxId,
        uint256 currency,
        uint256 tokenCount
    ) external returns (bool) {
        //require(msg.sender != owner(), "Admin cannot placeBid");
        require(
            msg.sender != _ownerOf(blindBoxId),
            "box owner cannot placeBid."
        );

        //拍卖上架
        require(blindBoxOnSale[blindBoxId].auctioned, "BlindBox not auctioned");

        require(!blindBoxOnSale[blindBoxId].isEndActioned, "BlindBox auction stoped.");


        uint256 price = priceManager.ethAmountToUsd(tokenCount);
        //第一次出价 或者最高出价
        if (
            blindBoxBidPrice[blindBoxId] == 0 ||
            blindBoxBidPrice[blindBoxId] < price
        ) {
            blindBoxBidPrice[blindBoxId] = price;
            blindBoxBidder[blindBoxId] = msg.sender;
        }
        return true;
    }

    function getPurchasedBlindBox(
        uint256 id
    )
        external
        view
        returns (
            bool purchased,
            bool revealed,
            uint256 purchaseTime,
            uint256 revealTime,
            bool auctioned
        )
    {
        BlindBoxManager.BlindBox memory b = blindBoxOnSale[id];
        return (
            b.purchased,
            b.revealed,
            b.purchaseTime,
            b.revealTime,
            b.auctioned
        );
    }

    function getBoxPrice(
        uint256 id
    )
        external
        view
        returns (
            uint256 price,
            address addr
        )
    {
        return  (blindBoxBidPrice[id], blindBoxBidder[id]);
    }

    function stopAuction(uint256 blindBoxId) public returns (bool){
        require(_ownerOf(blindBoxId)==msg.sender,"only owner of box can stop auction");

        BlindBoxManager.BlindBox storage box = blindBoxOnSale[blindBoxId];
        box.isEndActioned= true;
        address to = blindBoxBidder[blindBoxId]; 
        emit DebugBox("box stop auction.", blindBoxOnSale[blindBoxId]);
        //safeTransferFrom(address(this), to, blindBoxId);
        safeTransferFrom(_ownerOf(blindBoxId), to, blindBoxId);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}


    
}
