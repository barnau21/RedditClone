import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { Community, communityState } from '../../../atoms/communitiesAtom';
import { firestore } from '../../../firebase/clientApp';
import safejsonstringify from 'safe-json-stringify';
import NotFound from '../../../components/Community/NotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent'; 
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Posts from '../../../components/Posts/Posts';
import { useSetRecoilState } from 'recoil';
import About from '../../../components/Community/About';

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {
    const setCommunityStateValue = useSetRecoilState(communityState)

     // eslint-disable-next-line react-hooks/rules-of-hooks
     useEffect(() => {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityData])

    if(!communityData){
        return <NotFound />
    }
    
    
    return (
        <>
            <Header communityData={communityData}/>
            <PageContent>
                <>
                   <CreatePostLink />
                   <Posts communityData={communityData} />
                </>
                <>
                   <About communityData={communityData} />
                </>
            </PageContent>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext){
    ///get community data 

    try{
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);

        const communityDoc = await getDoc(communityDocRef);

        return { 
            props: {
            communityData : communityDoc.exists()
                ? JSON.parse(safejsonstringify({ id: communityDoc.id, ...communityDoc.data() })
                )
                : "", 
        },
    };
    }catch (error){
        //could add error page here
        console.log('get serve side props error: ', error)
    }
}
export default CommunityPage;