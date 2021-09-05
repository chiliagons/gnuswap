# THIS APP IS NOT PRODUCTION READY, IT IS IN DEVELOPMENT

## DEVELOPMENT PHASES

### 1. UI Implementation

This is the current phase, here we implement all the UI elements required. REMINDER: Implementation is not complete.

### 2. Error Handling

This is the phase in which most of the implementation will be complete and additional error handling will be provided.

### 3. Final fine tuning and production ready testing

The last phase will incorporate all the final goto production blockers and deploy to production.

<p align="center">
<img src="public/gnuswap.png" width="20%">
</p>
<h1 align="center">gnuswap</h1>
gnuswap is an Gnosis Safe App to exchange token across multiple chains. Gnosis safe is a widely used application by companies, asset holders as it helps in managing asset owned by multiple stakeholders by levarages multisig capabilities of the gnosis safe. It helps transfer assets easily within the safe.

## App screen

![Screenshot (481)](https://user-images.githubusercontent.com/55238388/126329570-70ef5120-3882-4a3d-be2c-2119e3869294.png)

## Features

- Easy hassle free swapping of tokens cross chain
- Directly integrated with gnosis safe
- Uses Connext to do cross chain swapping

## Why a Gnosis application

![Gnosis Safe Logo](https://i.imgur.com/owKjhMi.png)

- We chose gnosis as it is widely used by many crypto projects to manage assets
- Multi sig features
- It is has an application sdk which can be used to integrate with the wallet
- The gnosis ecosystem is growing and has a lot of good dapps/defi protcols
- It would be very convineant to transfer assets across chains owned by multiple parties
- Infact it was even used for a covid relief campaign in India!

## How we Built it

We integrated Gnosis Safe using the gnosis safe sdk with connext nxtp.
We utilized the Gnosis UI SDK to keep the elements as native as possible.

## Future Scope

- Show liquidity in routers
