/* eslint-disable require-jsdoc */
import React, { useEffect, useState } from 'react';
import { Col, Row, Input, Typography, Form, Button, Select, Table } from 'antd';
import { BigNumber, providers, Signer, utils } from 'ethers';
import pino from 'pino';
import { ActiveTransaction, NxtpSdk, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { AuctionResponse, getRandomBytes32, TransactionPreparedEvent } from '@connext/nxtp-utils';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';

import '../App.css';
import { chainConfig, swapConfig } from '../constants';
import { getBalance, mintTokens as _mintTokens } from '../utils';
import { connect } from 'tls';

const chainProviders: Record<number, { provider: providers.FallbackProvider; subgraph?: string; transactionManagerAddress?: string }> = {};
Object.entries(chainConfig).forEach(([chainId, { provider, subgraph, transactionManagerAddress }]) => {
  chainProviders[parseInt(chainId)] = {
    provider: new providers.FallbackProvider(provider.map((p) => new providers.JsonRpcProvider(p, parseInt(chainId)))),
    subgraph,
    transactionManagerAddress,
  };
});

function App(): React.ReactElement | null {
  const { sdk, safe } = useSafeAppsSDK();
  const gnosisWeb3Provider = new SafeAppProvider(safe, sdk);
  const [chainData, setChainData] = useState<any[]>([]);
  const [web3Provider, setProvider] = useState<providers.Web3Provider>();
  const [injectedProviderChainId, setInjectedProviderChainId] = useState<number>();
  const [signer, setSigner] = useState<Signer>();
  const [nsdk, setSdk] = useState<NxtpSdk>();
  const [auctionResponse, setAuctionResponse] = useState<AuctionResponse>();
  const [activeTransferTableColumns, setActiveTransferTableColumns] = useState<ActiveTransaction[]>([]);
  const [selectedPool, setSelectedPool] = useState(swapConfig[0]);
  const [errorFetchedChecker, setErrorFetchedChecker] = useState(false);
  const [userBalance, setUserBalance] = useState<BigNumber>();

  const [form] = Form.useForm();
  const ethereum = (window as any).ethereum;
  // const getTokensHandler = async (inputAddress) => {
  //   // const address = '0x73551b69314de75364fb5B58e766e40cB2c2973f';
  //   const address = inputAddress;
  //   let tokenArr = [];
  //   //https://www.npmjs.com/package/isomorphic-fetch
  //   await Axios.get(`https://safe-transaction.gnosis.io/api/v1/safes/${address}/balances/?trusted=false&exclude_spam=false`)
  //     .then((response) => {
  //       response.data.forEach((token) => {
  //         if (token.token !== null) {
  //           tokenArr.push(token.token);
  //         }
  //       });
  //       setTokenList(tokenArr);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const connectMetamask = async () => {
    // if (typeof ethereum === 'undefined') {
    //   alert('Please install Metamask');
    //   return;
    // }
    try {
      // await ethereum.request({ method: 'eth_requestAccounts' });
      // const provider = new providers.Web3Provider(ethereum);
      // const _signer = provider.getSigner();
      const provider2 = new providers.Web3Provider(gnosisWeb3Provider);
      const _signerG = await provider2.getSigner();
      if (_signerG) {
        const address = await _signerG.getAddress();
        console.log('address: ', address);
        // debugger

        const sendingChain = form.getFieldValue('sendingChain');
        console.log('sendingChain: ', sendingChain);

        const _balance = await getUserBalance(sendingChain, _signerG);
        setUserBalance(_balance);
        setSigner(_signerG);
        setProvider(provider2);
        form.setFieldsValue({ receivingAddress: address });
      }
      // metamask events
      // ethereum.on('chainChanged', (_chainId: string) => {
      //   console.log('_chainId: ', _chainId);
      //   window.location.reload();
      // });
      return true;
    } catch (e) {
      return false;
    }
  };

  const getUserBalance = async (chainId: number, _signer: Signer) => {
    const address = await _signer.getAddress();
    const sendingAssetId = swapConfig.find((sc) => sc.name === form.getFieldValue('asset'))?.assets[chainId];
    console.log('sendingAssetId: ', sendingAssetId);
    if (!sendingAssetId) {
      throw new Error('Bad configuration for swap');
    }
    if (!chainProviders || !chainProviders[chainId]) {
      throw new Error('No config for chainId');
    }
    const _balance = await getBalance(address, sendingAssetId, chainProviders[chainId].provider);
    return _balance;
  };

  useEffect(() => {
    async function testFunc() {
      const flag: boolean = await connectMetamask();
      console.log(flag);
      if (!flag) {
        setErrorFetchedChecker((c) => !c);
      }
    }
    testFunc();
    //console.log('LOG__FROM_CountriesTable: Executed');
  }, [errorFetchedChecker]);

  useEffect(() => {
    const init = async () => {
      const json = await utils.fetchJson('https://raw.githubusercontent.com/connext/chaindata/main/crossChain.json');
      setChainData(json);
      if (!signer || !web3Provider) {
        return;
      }
      const { chainId } = await signer.provider!.getNetwork();
      console.log('chainId: ', chainId);
      setInjectedProviderChainId(chainId);
      const _sdk = new NxtpSdk(
        chainProviders,
        signer,
        pino({ level: 'info' }),
        (process.env.REACT_APP_NETWORK as 'mainnet') ?? 'mainnet',
        process.env.REACT_APP_NATS_URL_OVERRIDE,
        process.env.REACT_APP_AUTH_URL_OVERRIDE,
      );
      setSdk(_sdk);
      const activeTxs = await _sdk.getActiveTransactions();

      // TODO: race condition with the event listeners
      // Will not update the transactions appropriately if sender tx prepared and no txs set
      setActiveTransferTableColumns(activeTxs);
      console.log('activeTxs: ', activeTxs);

      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
        console.log('SenderTransactionPrepared:', data);
        const { amount, expiry, preparedBlockNumber, ...invariant } = data.txData;
        const table = [...activeTransferTableColumns];
        table.push({
          crosschainTx: {
            invariant,
            sending: { amount, expiry, preparedBlockNumber },
          },
          bidSignature: data.bidSignature,
          encodedBid: data.encodedBid,
          encryptedCallData: data.encryptedCallData,
          status: NxtpSdkEvents.SenderTransactionPrepared,
        });
        setActiveTransferTableColumns(table);
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
        console.log('SenderTransactionFulfilled:', data);
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
        console.log('SenderTransactionCancelled:', data);
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
        console.log('ReceiverTransactionPrepared:', data);
        const { amount, expiry, preparedBlockNumber, ...invariant } = data.txData;
        const index = activeTransferTableColumns.findIndex((col) => col.crosschainTx.invariant.transactionId === invariant.transactionId);

        const table = [...activeTransferTableColumns];
        if (index === -1) {
          // TODO: is there a better way to
          // get the info here?
          table.push({
            crosschainTx: {
              invariant,
              sending: {} as any, // Find to do this, since it defaults to receiver side info
              receiving: { amount, expiry, preparedBlockNumber },
            },
            bidSignature: data.bidSignature,
            encodedBid: data.encodedBid,
            encryptedCallData: data.encryptedCallData,
            status: NxtpSdkEvents.ReceiverTransactionPrepared,
          });
          setActiveTransferTableColumns(table);
        } else {
          const item = { ...table[index] };
          table[index] = {
            ...item,
            status: NxtpSdkEvents.ReceiverTransactionPrepared,
            crosschainTx: {
              ...item.crosschainTx,
              receiving: { amount, expiry, preparedBlockNumber },
            },
          };
          setActiveTransferTableColumns(table);
        }
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
        console.log('ReceiverTransactionFulfilled:', data);
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
        console.log('ReceiverTransactionCancelled:', data);
        setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== data.txData.transactionId));
      });

      _sdk.attach(NxtpSdkEvents.SenderTokenApprovalMined, (data) => {
        console.log('SenderTokenApprovalMined:', data);
      });

      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepareSubmitted, (data) => {
        console.log('SenderTransactionPrepareSubmitted:', data);
      });
    };
    init();
  }, [web3Provider, signer]);

  const switchChains = async (targetChainId: number) => {
    if (!signer || !web3Provider) {
      return;
    }
    if (injectedProviderChainId === targetChainId) {
      return;
    }
    if (!chainConfig[targetChainId]) {
      throw new Error(`No provider configured for chain ${targetChainId}`);
    }
    const ethereum = (window as any).ethereum;
    if (typeof ethereum === 'undefined') {
      alert('Please install Metamask');
      return;
    }
    const chainId = '0x' + BigNumber.from(targetChainId)._hex.split('0x')[1].replace(/\b0+/g, '');
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId, rpcUrl: chainConfig[targetChainId] }],
          });
        } catch (addError) {
          // handle "add" error
          throw new Error(`Error adding chain ${targetChainId}: ${addError.message}`);
        }
      }
      throw error;
      // handle other "switch" errors
    }
  };

  const getTransferQuote = async (
    sendingChainId: number,
    sendingAssetId: string,
    receivingChainId: number,
    receivingAssetId: string,
    amount: string,
    receivingAddress: string,
  ): Promise<AuctionResponse | undefined> => {
    if (!nsdk) {
      return;
    }
    const provider = new providers.Web3Provider(ethereum);
    const _signer = provider.getSigner();
    setSigner(_signer);
    setProvider(provider);

    if (injectedProviderChainId !== sendingChainId) {
      alert('Please switch chains to the sending chain!');
      throw new Error('Wrong chain');
    }

    // Create txid
    const transactionId = getRandomBytes32();

    const response = await nsdk.getTransferQuote({
      sendingAssetId,
      sendingChainId,
      receivingChainId,
      receivingAssetId,
      receivingAddress,
      amount,
      transactionId,
      expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
    });
    setAuctionResponse(response);
    return response;
  };

  const transfer = async () => {
    if (!nsdk) {
      return;
    }
    const provider2 = new providers.Web3Provider(gnosisWeb3Provider);
    const _signerG = provider2.getSigner();
    setSigner(_signerG);
    setProvider(provider2);
    if (!auctionResponse) {
      alert('Please request quote first');
      throw new Error('Please request quote first');
    }

    if (injectedProviderChainId !== auctionResponse.bid.sendingChainId) {
      alert('Please switch chains to the sending chain!');
      throw new Error('Wrong chain');
    }
    const transfer = await nsdk.prepareTransfer(auctionResponse, true);
    console.log('transfer: ', transfer);
  };

  const finishTransfer = async ({ bidSignature, encodedBid, encryptedCallData, txData }: Omit<TransactionPreparedEvent, 'caller'>) => {
    if (!nsdk) {
      return;
    }

    const finish = await nsdk.fulfillTransfer({ bidSignature, encodedBid, encryptedCallData, txData });
    console.log('finish: ', finish);
    if (finish.metaTxResponse?.transactionHash || finish.metaTxResponse?.transactionHash === '') {
      setActiveTransferTableColumns(activeTransferTableColumns.filter((t) => t.crosschainTx.invariant.transactionId !== txData.transactionId));
    }
  };

  const columns = [
    {
      title: 'Transaction Id',
      dataIndex: 'txId',
      key: 'txId',
    },
    {
      title: 'Sending Chain',
      dataIndex: 'sendingChain',
      key: 'sendingChain',
    },
    {
      title: 'Receiving Chain',
      dataIndex: 'receivingChain',
      key: 'receivingChain',
    },
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Expires',
      dataIndex: 'expires',
      key: 'expires',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: ({ crosschainTx, status, bidSignature, encodedBid, encryptedCallData }: ActiveTransaction) => {
        const { receiving, sending, invariant } = crosschainTx;
        const variant = receiving ?? sending;
        const sendingTxData = {
          ...invariant,
          ...sending,
        };

        const receivingTxData =
          typeof receiving === 'object'
            ? {
                ...invariant,
                ...receiving,
              }
            : undefined;
        if (Date.now() / 1000 > variant.expiry) {
          return (
            <Button
              type="link"
              onClick={() => nsdk?.cancel({ relayerFee: '0', signature: '0x', txData: sendingTxData }, crosschainTx.invariant.sendingChainId)}
            >
              Cancel
            </Button>
          );
        } else if (status === NxtpSdkEvents.ReceiverTransactionPrepared) {
          return (
            <Button
              type="link"
              onClick={() => {
                if (!receivingTxData) {
                  console.error('Incorrect data to fulfill');
                  return;
                }
                finishTransfer({ bidSignature, encodedBid, encryptedCallData, txData: receivingTxData });
              }}
            >
              Finish
            </Button>
          );
        } else {
          return <></>;
        }
      },
    },
  ];

  const mintTokens = async () => {
    const testToken = swapConfig.find((sc) => sc.name === form.getFieldValue('asset'))?.assets[injectedProviderChainId!];
    if (!testToken) {
      throw new Error(`Not configured for TEST token on chain: ${injectedProviderChainId}`);
    }
    const resp = await _mintTokens(signer!, testToken);
    console.log('resp: ', resp);
  };

  const addToMetamask = async () => {
    const testToken = swapConfig.find((sc) => sc.name === form.getFieldValue('asset'))?.assets[injectedProviderChainId!];
    if (!testToken) {
      throw new Error(`Not configured for TEST token on chain: ${injectedProviderChainId}`);
    }
    const resp = await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: testToken,
          symbol: 'TEST',
          decimals: 18,
        },
      },
    });
    console.log('resp: ', resp);
  };

  const getChainName = (chainId: number): string => {
    const chain = chainData.find((chain) => chain?.chainId === chainId);
    return chain?.name ?? chainId.toString();
  };

  return (
    <div style={{ marginTop: 36, marginLeft: 12, marginRight: 12 }}>
      {/* <Col>
        <Button type="primary" onClick={connectMetamask} disabled={!!web3Provider}>
          Connect Metamask
        </Button>
      </Col> */}

      {activeTransferTableColumns.length > 0 && (
        <>
          <Row gutter={16}>
            <Col span={3}></Col>
            <Col span={8}>
              <Typography.Title level={2}>Active Transfers</Typography.Title>
            </Col>
          </Row>
          <Row>
            <Col span={3}></Col>
            <Col span={20}>
              <Table
                columns={columns}
                dataSource={activeTransferTableColumns.map((tx) => {
                  // Use receiver side info by default
                  const variant = tx.crosschainTx.receiving ?? tx.crosschainTx.sending;
                  return {
                    amount: variant.amount,
                    status: tx.status,
                    sendingChain: tx.crosschainTx.invariant.sendingChainId.toString(),
                    receivingChain: tx.crosschainTx.invariant.receivingChainId.toString(),
                    asset: 'TEST',
                    key: tx.crosschainTx.invariant.transactionId,
                    txId: `${tx.crosschainTx.invariant.transactionId.substr(0, 6)}...${tx.crosschainTx.invariant.transactionId.substr(
                      tx.crosschainTx.invariant.transactionId.length - 5,
                      tx.crosschainTx.invariant.transactionId.length - 1,
                    )}`,
                    expires: variant.expiry > Date.now() / 1000 ? `${((variant.expiry - Date.now() / 1000) / 3600).toFixed(2)} hours` : 'Expired',
                    action: tx,
                  };
                })}
              />
            </Col>
            <Col span={3}></Col>
          </Row>
        </>
      )}
      <Row gutter={16}>
        <Col span={16}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={() => {
              transfer();
            }}
            onFieldsChange={(changed) => {
              console.log('changed: ', changed);
            }}
            initialValues={{
              sendingChain: getChainName(parseInt(Object.keys(selectedPool.assets)[0])),
              receivingChain: getChainName(parseInt(Object.keys(selectedPool.assets)[1])),
              asset: selectedPool.name,
              amount: '1',
            }}
          >
            <Form.Item label="Sending Chain" name="sendingChain">
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="sendingChain">
                    <Select
                      onChange={async (val) => {
                        console.log('val: ', val);
                        if (!signer) {
                          console.error('No signer available');
                          return;
                        }
                        const _balance = await getUserBalance(val as number, signer);
                        setUserBalance(_balance);
                      }}
                    >
                      {Object.keys(selectedPool.assets).map((chainId) => (
                        <Select.Option key={chainId} value={chainId}>
                          {getChainName(parseInt(chainId))}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item dependencies={['sendingChain']}>
                    {() => (
                      <Button
                        onClick={() => switchChains(parseInt(form.getFieldValue('sendingChain')))}
                        disabled={!web3Provider || injectedProviderChainId === parseInt(form.getFieldValue('sendingChain'))}
                      >
                        Switch To Chain {getChainName(parseInt(form.getFieldValue('sendingChain')))}
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Receiving Chain">
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="receivingChain">
                    <Select>
                      {Object.keys(selectedPool.assets).map((chainId) => (
                        <Select.Option key={chainId} value={chainId}>
                          {getChainName(parseInt(chainId))}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Asset" name="asset">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="asset">
                    <Select onChange={(value) => (value ? setSelectedPool(swapConfig[parseInt(value?.toString())]) : '')}>
                      {swapConfig.map(({ name }) => (
                        <Select.Option key={name} value={name}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* {form.getFieldValue('asset') === 'TEST' && (
                  <>
                    <Col span={6}>
                      <Button block onClick={() => mintTokens()}>
                        Get TEST
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button disabled={!web3Provider} type="link" onClick={() => addToMetamask()}>
                        Add to Metamask
                      </Button>
                    </Col>
                  </>
                )} */}
              </Row>
            </Form.Item>

            <Form.Item label="Amount">
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="amount">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  Balance:{' '}
                  <Button onClick={() => form.setFieldsValue({ amount: utils.formatEther(userBalance ?? 0) })} type="link">
                    {utils.formatEther(userBalance ?? 0)}
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Receiving Address" name="receivingAddress">
              <Input />
            </Form.Item>

            <Form.Item label="Received Amount" name="receivedAmount">
              <Input
                disabled
                placeholder="..."
                addonAfter={
                  <Button
                    disabled={!web3Provider || injectedProviderChainId !== parseInt(form.getFieldValue('sendingChain'))}
                    type="primary"
                    onClick={async () => {
                      const sendingAssetId = swapConfig.find((sc) => sc.name === form.getFieldValue('asset'))?.assets[form.getFieldValue('sendingChain')];
                      const receivingAssetId = swapConfig.find((sc) => sc.name === form.getFieldValue('asset'))?.assets[form.getFieldValue('receivingChain')];
                      if (!sendingAssetId || !receivingAssetId) {
                        throw new Error("Configuration doesn't support selected swap");
                      }
                      const response = await getTransferQuote(
                        parseInt(form.getFieldValue('sendingChain')),
                        sendingAssetId,
                        parseInt(form.getFieldValue('receivingChain')),
                        receivingAssetId,
                        utils.parseEther(form.getFieldValue('amount')).toString(),
                        form.getFieldValue('receivingAddress'),
                      );
                      form.setFieldsValue({ receivedAmount: utils.formatEther(response!.bid.amountReceived) });
                    }}
                  >
                    Get Quote
                  </Button>
                }
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} dependencies={['sendingChain', 'receivingChain']}>
              {() => (
                <Button
                  disabled={form.getFieldValue('sendingChain') === form.getFieldValue('receivingChain') || !auctionResponse}
                  type="primary"
                  htmlType="submit"
                >
                  Transfer
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default App;
