// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC4906} from "@openzeppelin/contracts/interfaces/IERC4906.sol";

contract GymBadge is ERC721, Ownable, IERC4906 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => bool) public isGymLeader;

    string private _baseTokenURI;

    event BadgeIssued(
        address indexed gymLeader,
        address indexed trainer,
        uint256 tokenId
    );

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
        Ownable(msg.sender)
    {
        //Default construction.
    }

    function sendBadge(address _trainer) public {
        require(isGymLeader[msg.sender], "Caller is not a gym leader");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(_trainer, newTokenId);
        emit BadgeIssued(msg.sender, _trainer, newTokenId);
    }

    function checkGymLeader(address _address) public view returns (bool) {
        return isGymLeader[_address];
    }

    function addGymLeader(address _newGymLeader) public onlyOwner {
        isGymLeader[_newGymLeader] = true;
    }

    function removeGymLeader(address _gymLeader) public onlyOwner {
        isGymLeader[_gymLeader] = false;
    }

    function renounceOwnership() public virtual override onlyOwner {
        revert("Ownership cannot be renounced");
    }

    function setMetadata(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BatchMetadataUpdate(1, type(uint256).max);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(ownerOf(_tokenId) != address(0), "ERC721: URI query for nonexistent token");
        return _baseTokenURI;
    }
}
