import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import EventEmitter from './EventEmitter';



export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super();

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
        
    }


    /*------------------ Methods -----------------*/    

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        
        // DRACO Loader (for compressed glTF files)
        //this.loaders.gltfLoader.setDRACOLoader(new THREE.DRACOLoader().setDecoderPath('/draco/'))

        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                       this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                       this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTex')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                       this.sourceLoaded(source, file)
                    }
                )
            }

            
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file
        this.loaded++
        if(this.loaded === this.toLoad)
        {
            console.log('~Resources Loaded');
            this.trigger('ready')
        }
    }


}