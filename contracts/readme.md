**ERC20/ERC721合约中的transferFrom接口如何使用**
trasferFrom(sender, recipient,amount), 由sender地址向recipient转账amount,
该函数有授权验证的过程，即验证该函数的调用者是否有转账amount额度的权限，如果授权验证通过，
同时会减去相应转账额度。这个方法一般是作为token持有者和业务逻辑解偶使用的，即第三方代转的过程。
如空投合约的业务场景，空投合约中仅包含空投相关业务函数，真正执行空投的的转账业务时，由空投合
约代转，调用相erc20/ERC721的trasferFrom函数，erc20/721对调用者进行授权验证。
erc20/721转账的本质是“转别人的token”，"操作别人的nft"。


b：ERC721中的授权接口跟ERC20有何不同
ERC20是同质化合约，所有的token是一样的，


c：ERC721合约中的safeTransfer等带safe前缀的接口提供了什么安全措施